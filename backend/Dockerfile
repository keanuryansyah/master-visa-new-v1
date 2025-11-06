# =========================
# 1️⃣ Build Stage
# =========================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy only dependency files first (better Docker caching)
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Provide temporary DATABASE_URL for Prisma generation
ENV DATABASE_URL="mysql://user:password@localhost:3306/db"

# Install all dependencies (including dev)
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

# Copy only necessary runtime files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/public ./public

# Remove dev dependencies
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="mysql://visa_user:mastervisaku.com@pass@db:3306/master-visa"

EXPOSE 3000

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
