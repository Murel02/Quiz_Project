# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the application dependencies defined in package.json
RUN npm install

# Copy the entire project directory contents to the working directory in the container
COPY . .

# Expose port 3000 to the host machine for the application
EXPOSE 3000

# Set the default command to run the app.js file with Node.js
CMD ["node", "app.js"]
