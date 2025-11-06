# =========================
# 1️⃣ Build Stage
# =========================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy minimal files first for better caching
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Provide temporary DATABASE_URL so prisma generate works
ENV DATABASE_URL="mysql://user:password@localhost:3306/db"

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy full source code
COPY . .

# =========================
# 2️⃣ Production Stage
# =========================
FROM node:24-alpine AS production

WORKDIR /app

# Copy necessary runtime files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.js ./index.js

# Remove dev dependencies for smaller image
RUN npm prune --production

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="mysql://visa_user:mastervisaku.com@pass@db:3306/master-visa"

EXPOSE 3000

# ✅ Entry point
# Try migrate deploy; if it fails, fallback to db push
CMD sh -c "npx prisma migrate deploy |
