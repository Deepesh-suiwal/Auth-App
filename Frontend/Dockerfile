
# FROM node:18 AS builder


# WORKDIR /app

# COPY package*.json ./


# RUN npm install


# COPY . .

# RUN npm run build


# FROM nginx:alpine


# COPY --from=builder /app/dist /usr/share/nginx/html


# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]


# frontend/Dockerfile
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve build with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

