# Multi-stage build for Next.js SSR application
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables with defaults
# NEXT_PUBLIC_* variables MUST be available during build (embedded in bundle)
# These defaults ensure the build works; ECS task definition also has these for reference
ARG NEXT_PUBLIC_API_BASE_URL=https://staging-api.revs.gg/api/v1/
ARG NEXT_PUBLIC_CDN_URL=https://d1sdj94qdia6yh.cloudfront.net
ARG NEXT_PUBLIC_ALLOWED_DOMAIN=staging.revs.gg
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RjhMzPfWSjK5runfYnTYmtF1t5p4ITZCUVvkqn4UE5scp0sNpHmpxalFF09yt6hUvGiGsXS8ZvwZdpiQWUcp1tc00p3xFwqFS

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_CDN_URL=${NEXT_PUBLIC_CDN_URL}
ENV NEXT_PUBLIC_ALLOWED_DOMAIN=${NEXT_PUBLIC_ALLOWED_DOMAIN}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NODE_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application (NEXT_PUBLIC_* vars are embedded here)
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

