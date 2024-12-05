// Load environment variables from the .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Framework for building web applications
const mongoose = require('mongoose'); // MongoDB object modeling library
const userRoutes = require('./routes/userRoutes'); // Routes for user-related features
const quizRoutes = require('./routes/quizRoutes'); // Routes for quiz-related features
const session = require('express-session'); // Middleware for session management

// Initialize the Express application
const app = express();

// Middleware to handle URL-encoded form submissions
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON payloads
app.use(express.json());

// Set EJS as the templating engine for rendering views
app.set('view engine', 'ejs');

// Serve static files (e.g., CSS, images, JavaScript) from the "public" directory
app.use(express.static('public'));

// Configure session middleware
app.use(session({
    secret: 'verySecretKey', // Secret key used to sign session cookies
    resave: false, // Avoid resaving session data if it hasn't been modified
    saveUninitialized: true, // Save uninitialized session data
    cookie: { secure: false } // Use secure cookies (set to `true` when using HTTPS)
}));

// Connect to the MongoDB database using the connection string from the .env file
mongoose.connect(process.env.DB_URI, {})
    .then(() => console.log("MongoDB Connected")) // Log successful connection
    .catch(err => console.error("MongoDB Connection Error")); // Log connection errors

// Middleware to check if a user is logged in
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId; // Add `isLoggedIn` variable to all responses
    next(); // Move to the next middleware or route
});

// Define routes
app.use('/', userRoutes); // Use user-related routes
app.use('/', quizRoutes); // Use quiz-related routes

// Start the server on the specified port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/home`); // Log the server URL
});
