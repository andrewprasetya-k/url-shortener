# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Baked into the client bundle at build time — must be the backend's
# publicly reachable URL, not a Docker-internal service name.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_SHORT_URL_BASE
ENV NEXT_PUBLIC_SHORT_URL_BASE=$NEXT_PUBLIC_SHORT_URL_BASE

RUN npm run build

# Stage 2: Run
# Next.js standalone output — needed because app/proxy.ts (middleware) requires
# a live Node server; it cannot be served as static files (e.g. via nginx).
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
CMD ["node", "server.js"]
