# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose the application port (actual port comes from $PORT at runtime,
# forced to 8080 via docker-compose.yaml to match the published port)
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/main"]
