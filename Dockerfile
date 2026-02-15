# --- Stage 1: Base (ติดตั้ง dependencies) ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- Stage 2: Development (ใช้รันตอนเขียนโค้ด) ---
FROM base AS development
COPY . .
# ในโหมด dev เรามักใช้ nodemon เพื่อให้ restart อัตโนมัติ
CMD ["npm", "run", "dev"]

# --- Stage 3: Build (สำหรับทำ Production) ---
FROM base AS builder
COPY . .
RUN npm run build

# --- Stage 4: Production ---
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY server.js .
USER node
EXPOSE 5001
CMD ["node", "server.js"]
