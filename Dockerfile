# Frontend - Vue 3 + Vite, build (Bun) puis service statique par nginx
FROM oven/bun:1-alpine AS build

WORKDIR /app

# URL publique de l'API, figée dans le bundle au build (Vite lit import.meta.env
# à la compilation : une variable d'environnement au runtime serait ignorée).
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
# Commit de l'image (fourni par le CI) : console du site et logs du conteneur
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig*.json vite.config.ts index.html nginx.conf ./
COPY public/ ./public/
COPY src/ ./src/
RUN bun run build
# La CSP autorise l'API (connect-src, form-action) : son origine vient du même
# argument. URL vide ou invalide (variable CI absente) = build en échec, pas une
# image qui bloquerait silencieusement l'API.
RUN origin=$(bun -e 'console.log(new URL(process.env.VITE_API_URL).origin)') && sed -i "s|__API_ORIGIN__|$origin|g" nginx.conf
# Version en tête des logs : nginx lance /docker-entrypoint.d/*.sh au démarrage
RUN printf '#!/bin/sh\necho "SilverTransfert front v%s (%.7s)"\n' "$(bun -e 'console.log(require("./package.json").version)')" "$GIT_SHA" > 00-version.sh

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build --chmod=755 /app/00-version.sh /docker-entrypoint.d/00-version.sh
EXPOSE 4173
