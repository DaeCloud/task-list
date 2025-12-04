# ----------------------------
# Build Stage
# ----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build Next.js project
RUN npm run build

# ----------------------------
# Production Stage
# ----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and node_modules
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy Next.js build output
COPY --from=builder /app/.next ./.next

# Copy public folder
COPY --from=builder /app/public ./public

# Copy app/pages directories if they exist (required for Next 13 app dir)
COPY --from=builder /app/app ./app
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/next.config.js ./  # copy next.config.js if exists

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
