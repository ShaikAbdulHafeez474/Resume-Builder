
# Example Dockerfile for a Node.js service
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port your service runs on (e.g., 5000)
EXPOSE 5000

# Start the service
CMD ["npm", "start"]
