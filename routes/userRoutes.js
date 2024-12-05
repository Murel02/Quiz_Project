// Import necessary modules
const express = require('express'); // Framework for building web applications
const router = express.Router(); // Router instance to define route handlers
const User = require('../models/user'); // User model for database operations
const userController = require('../controllers/userController'); // Controller for user-related logic
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to ensure authentication

// Route to render the home page with the leaderboard of top players
router.get('/home', async (req, res) => {
    try {
        // Fetch the top 3 players sorted by score in descending order
        const topPlayers = await User.find().sort({ score: -1 }).limit(3);

        // Render the "home" template, passing login status and top players
        res.render('home', {
            isLoggedIn: !!req.session.userId, // Boolean indicating if the user is logged in
            topPlayers // Pass top players to the view
        });
    } catch (err) {
        // Handle errors while fetching leaderboard data
        console.error('Error fetching leaderboard for homepage:', err.message);
        res.status(500).send('An error occurred while loading the homepage.');
    }
});

// Route to render the login page
router.get('/login', (req, res) => {
    // Render the login view with optional success message from query parameters
    res.render('login', { success: req.query.success });
});

// Route to handle login form submission
router.post('/login', userController.login); // Delegate login logic to the userController

// Route to render the registration page
router.get('/register', (req, res) => {
    res.render('createUser'); // Render the registration view (createUser.ejs)
});

// Route to handle user registration form submission
router.post('/register', userController.createUser); // Delegate user creation logic to the userController

// Route to render the leaderboard page
router.get('/leaderboard', authMiddleware, async (req, res) => {
    try {
        // Fetch all users sorted by score in descending order
        const users = await User.find().sort({ score: -1 });

        // Render the leaderboard view with the list of users
        res.render('leaderboard', { users });
    } catch (err) {
        // Handle errors while fetching leaderboard data
        console.error('Error fetching leaderboard:', err.message);
        res.status(500).send('An error occurred while loading the leaderboard.');
    }
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    // Destroy the user's session
    req.session.destroy(err => {
        if (err) {
            // Handle errors during session destruction
            console.error('Error logging out:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        // Redirect to the home page after successful logout
        res.redirect('/home');
    });
});

// Export the router to make it available for use in the main application
module.exports = router;
