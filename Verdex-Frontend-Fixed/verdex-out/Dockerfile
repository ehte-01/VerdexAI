# Stage 1 - build the static export (output: 'export' -> /app/out)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 - Caddy serves the static files and proxies /api to the backend
FROM caddy:2-alpine
COPY --from=build /app/out /srv
