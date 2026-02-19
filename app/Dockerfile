# =========================
# 1️⃣ Frontend Build Stage
# =========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
RUN npm run build


# =========================
# 2️⃣ Backend Build Stage
# =========================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend ./
RUN npm run build


# =========================
# 3️⃣ Production Stage
# =========================
FROM node:20-alpine AS production

WORKDIR /app/backend

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./

# Install only production deps
RUN npm ci --omit=dev

# Copy frontend build into public folder
COPY --from=frontend-builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]

