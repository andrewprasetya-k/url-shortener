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

# output: "export" in next.config.ts produces a static ./out folder —
# no middleware/SSR/API routes are used, so no Node server is needed at runtime.
RUN npm run build

# Stage 2: Serve the static export via nginx
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
