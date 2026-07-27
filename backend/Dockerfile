FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
RUN npm ci --workspace backend --include-workspace-root

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
WORKDIR /app/backend
EXPOSE 4000
CMD ["npm", "run", "start"]
