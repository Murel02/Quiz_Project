// Load environment variables from a .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Express framework for building web applications
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions
const bodyParser = require('body-parser'); // Middleware to parse HTTP request body
const userRoutes = require('./routes/userRoutes'); // Routes for user-related functionality

// Initialize the Express application
const app = express();

// Use body-parser to handle URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON payloads
app.use(express.json());

// Set the view engine to EJS for rendering dynamic HTML pages
app.set('view engine', 'ejs');

// Connect to the MongoDB database using credentials from the .env file
mongoose.connect(process.env.DB_URI, {})
    .then(() => console.log("MongoDB Connected")) // Log successful connection
    .catch(err => console.error("MongoDB Connection Error")); // Log connection errors

// Use user routes for handling requests starting with "/"
app.use('/', userRoutes);

// Set the port for the application, defaulting to 3000 if not specified in the .env file
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
});
