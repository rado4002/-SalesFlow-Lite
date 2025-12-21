# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm ci

# Copier le code
COPY . .

# Build Vite
RUN npm run build

# =========================
# RUNTIME STAGE (NGINX)
# =========================
FROM nginx:alpine

# Config Nginx pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
