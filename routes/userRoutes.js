// Route file
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Render Home Page with Top Players
router.get('/home', async (req, res) => {
    try {
        // Fetch top 3 players
        const topPlayers = await User.find().sort({ score: -1 }).limit(3);

        // Pass `isLoggedIn` and `topPlayers` to the template
        res.render('home', {
            isLoggedIn: !!req.session.userId,
            topPlayers
        });
    } catch (err) {
        console.error('Error fetching leaderboard for homepage:', err.message);
        res.status(500).send('An error occurred while loading the homepage.');
    }
});

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login', { success: req.query.success });
});
// Handle login
router.post('/login', userController.login);

// Render Register Page
router.get('/register', (req, res) => {
    res.render('createUser'); // Render the `register.ejs` file
});

// Handle Registration Submission
router.post('/register', userController.createUser);

// Render leaderboard
router.get('/leaderboard',authMiddleware ,async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }); // Sort users by score (descending)
        res.render('leaderboard', { users }); // Render the leaderboard view with sorted users
    } catch (err) {
        console.error('Error fetching leaderboard:', err.message);
        res.status(500).send('An error occurred while loading the leaderboard.');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        res.redirect('/home'); // Redirect to the home after logout
    });
});

module.exports = router;
