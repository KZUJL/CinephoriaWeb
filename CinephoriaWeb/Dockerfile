# Étape 1 : build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN chmod +x node_modules/.bin/vue-tsc && chmod +x node_modules/.bin/vite && npx vue-tsc -b && npx vite build
RUN npx vue-tsc -b && npx vite build

# Étape 2 : Nginx pour servir le front
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
