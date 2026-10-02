# ── Etapa 1: dependencias ─────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Etapa 2: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* se hornean en el bundle en build time — pasar como ARG
ARG NEXT_PUBLIC_IVA_PORCENTAJE
ENV NEXT_PUBLIC_IVA_PORCENTAJE=$NEXT_PUBLIC_IVA_PORCENTAJE

RUN npm run build

# ── Etapa 3: runner ───────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
