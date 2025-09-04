# Étape 1 : build
FROM node:18 AS build
WORKDIR /app

# Copier seulement package.json et package-lock.json pour profiter du cache Docker
COPY CinephoriaWeb/package*.json ./

RUN npm install

# Copier le reste du projet front
COPY CinephoriaWeb/ .

# Build Vue
RUN npx vue-tsc -b && npx vite build

# Étape 2 : Nginx pour servir le front
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
