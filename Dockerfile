# Frontend Dockerfile - Vue 3 + Vite (preview mode)
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json tsconfig*.json vite.config.ts ./
COPY public/ ./public/
COPY src/ ./src/

# Installer les dépendances
RUN npm install

# Builder pour la production
RUN npm run build

# Exposer le port 4173 (port par défaut de vite preview)
EXPOSE 4173

# Lancer vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
