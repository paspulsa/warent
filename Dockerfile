# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user non-root untuk keamanan (Opsional tapi disarankan)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file yang diperlukan saja
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/services ./services
COPY --from=builder /app/config ./config
COPY --from=builder /app/lib ./lib

# Buat folder sessions dan atur izin akses agar Baileys bisa menulis file sesi
RUN mkdir -p /app/sessions && chown -R nextjs:nodejs /app/sessions

USER nextjs

EXPOSE 3000
EXPOSE 5000

# Default command (bisa dioverride di docker-compose)
CMD ["npm", "start"]
