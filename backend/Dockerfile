# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/main"]
