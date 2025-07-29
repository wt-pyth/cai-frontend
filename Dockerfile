FROM node:20-alpine

WORKDIR /app

# Copy the .npmrc file created by Cloud Build
COPY .npmrc ./

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application using pm2-runtime
CMD ["pm2-runtime", "start", "npm", "--", "start"]
