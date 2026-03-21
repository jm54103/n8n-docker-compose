# =========================
# 1.Frontend Build Stage
# =========================
FROM node:20-alpine AS frontend-builder

# =========================

WORKDIR /frontend/admin

COPY frontend/admin/package*.json ./
RUN npm ci

COPY frontend/admin ./
RUN npm run build

# =========================

WORKDIR /frontend/chart

COPY frontend/chart/package*.json ./
RUN npm ci

COPY frontend/chart ./
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
RUN mkdir -p ./public/admin
COPY --from=frontend-builder /frontend/admin/public ./public
COPY --from=frontend-builder /frontend/admin/dist ./public/admin


RUN mkdir -p ./public/chart
COPY --from=frontend-builder /frontend/chart/dist ./public/chart

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main.js"]
