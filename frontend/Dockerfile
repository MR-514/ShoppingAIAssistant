# Use Node.js 18 Alpine base image
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Next.js app (creates .next folder)
RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]
