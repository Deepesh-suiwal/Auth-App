# Use official Node.js base image for building
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Build the Vite app (outputs to /app/dist)
RUN npm run build

# ----------------------
# Use an NGINX image to serve the static site
# ----------------------
FROM nginx:alpine

# Remove the default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 in the container
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
