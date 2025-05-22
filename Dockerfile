FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
ARG VUE_APP_BASE_URL
ENV VUE_APP_BASE_URL $VUE_APP_BASE_URL
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
