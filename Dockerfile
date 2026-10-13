# Frontend - Vue 3 + Vite, build puis service statique par nginx
FROM node:22-alpine AS build

WORKDIR /app

# URL publique de l'API, figée dans le bundle au build (Vite lit import.meta.env
# à la compilation : une variable d'environnement au runtime serait ignorée).
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json vite.config.ts index.html nginx.conf ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build
# La CSP autorise l'API (connect-src, form-action) : son origine vient du même
# argument. URL vide ou invalide (variable CI absente) = build en échec, pas une
# image qui bloquerait silencieusement l'API.
RUN origin=$(node -p 'new URL(process.env.VITE_API_URL).origin') && sed -i "s|__API_ORIGIN__|$origin|g" nginx.conf

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 4173
