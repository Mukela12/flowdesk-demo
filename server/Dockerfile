# Build stage
FROM node:20-alpine AS builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Also build the client for serving static files
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy server
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server
RUN mkdir -p uploads

EXPOSE 3001

# Run migration then start server
CMD ["sh", "-c", "npx tsx src/db/migrate.ts && npx tsx src/index.ts"]
