FROM node:20-alpine AS builder
WORKDIR /app

# build-args로 받은 Vite 환경변수를 빌드 시점에 노출
ARG VITE_SERVER_URL_API
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_SERVER_URL_API=$VITE_SERVER_URL_API
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx-app.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]