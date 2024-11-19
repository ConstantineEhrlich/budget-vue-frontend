# https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html
FROM node:lts-alpine as build-stage
ARG API_URL
ENV VITE_API_URL=${API_URL}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
COPY ./server.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]