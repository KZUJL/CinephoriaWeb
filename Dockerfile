# Étape 1 : build
FROM node:18 AS build
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY CinephoriaWeb/package*.json ./

RUN npm install

# Copier tout le reste du projet
COPY CinephoriaWeb/ .

# Lancer le build via le script npm
RUN npm run build

# Étape 2 : Nginx pour servir le front
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
