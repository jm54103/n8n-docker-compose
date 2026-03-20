# =========================
# 1.Frontend Build Stage
# =========================
FROM node:20-alpine AS frontend-builder

WORKDIR /webs/frontend

COPY frontend/chart/package*.json ./
RUN npm ci

COPY frontend/chart/ ./
RUN npm run build


# =========================
# 2️.Backend Build Stage
# =========================
FROM node:20-alpine AS backend-builder

WORKDIR /webs/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend ./
RUN npm run build


# =========================
# 3️.Production Stage
# =========================
FROM node:20-alpine AS production

WORKDIR /webs/backend

# Copy backend build
COPY --from=backend-builder /webs/backend/dist ./dist
COPY --from=backend-builder /webs/backend/package*.json ./

# Install only production deps
RUN npm ci --omit=dev

# Copy frontend build into public folder
COPY --from=frontend-builder /webs/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main.js"]

