FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start in production mode
CMD ["npm", "start"]
