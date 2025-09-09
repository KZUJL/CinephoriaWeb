# Étape 1 : build
FROM node:18 AS build
WORKDIR /app

# Copier seulement package.json pour cache npm
COPY CinephoriaWeb/package*.json ./
RUN npm install

# Copier le reste
COPY CinephoriaWeb/ .

# Build (vite build suffit)
RUN npm run build

# Étape 2 : Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080