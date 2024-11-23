# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:20 AS build

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Cài đặt global package (nodemon)
RUN npm install -g nodemon

# Copy toàn bộ mã nguồn vào container (trừ những file được liệt kê trong .dockerignore)
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the server
CMD ["npm", "start"]