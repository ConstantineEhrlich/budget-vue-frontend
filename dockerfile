# https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG API_URL="mybudget.today"
RUN echo "VITE_API_URL=$API_URL" > .env.production && chmod 644 .env.production
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
COPY ./server.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]