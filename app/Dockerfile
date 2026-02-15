# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Development ----------
FROM base AS development
COPY . .
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# ---------- Builder ----------
FROM base AS builder
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.js .

ENV NODE_ENV=production
EXPOSE 5000

RUN chown -R node:node /app
USER node

CMD ["node", "server.js"]
