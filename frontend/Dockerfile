FROM node:24-alpine AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
RUN npm ci --workspace frontend --include-workspace-root
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
