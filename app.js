require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({ extended: true })); // Handles form submissions
app.use(express.json()); // Handles JSON payloads
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session middleware configuration
app.use(session({
    secret: 'verySecretKey', // Secret key
    resave: false, // Avoid resaving session if it hasn't been modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error"));

// Check if user is logged in
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId; // `true` if logged in, `false` otherwise
    next();
});

// Define routes
app.use('/', userRoutes);
app.use('/', quizRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/home`);
});
