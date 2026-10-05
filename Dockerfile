# Frontend - Vue 3 + Vite (preview mode)
FROM node:20-alpine

WORKDIR /app

# URL publique de l'API, figée dans le bundle au build (Vite lit import.meta.env
# à la compilation : une variable d'environnement au runtime serait ignorée).
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
# Optionnel : domaine CDN pour le téléchargement des chunks (vide = l'API)
ARG VITE_CDN_URL=
ENV VITE_CDN_URL=$VITE_CDN_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json vite.config.ts index.html ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

# vite preview compile sa config dans node_modules/.vite-temp
RUN mkdir -p node_modules/.vite-temp && chown node:node node_modules/.vite-temp
USER node
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
