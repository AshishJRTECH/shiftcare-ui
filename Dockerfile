# FROM node:20.12.2

# WORKDIR /app

# COPY package.json .

# RUN npm install --force

# COPY . .

# RUN npm run build

# CMD ["npm","start"]



# Stage 1: Build the application
FROM node:20.12.2 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application using a minimal image
FROM node:20.12.2

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public


# Install production dependencies
ENV NODE_ENV=production
RUN npm install --only=production

# Expose the application port
EXPOSE 14001

# Start the application
CMD ["npm", "start"]


