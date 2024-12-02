// Route file
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

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

// Render leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }); // Sort users by score (descending)
        res.render('leaderboard', { users }); // Render the leaderboard view with sorted users
    } catch (err) {
        console.error('Error fetching leaderboard:', err.message);
        res.status(500).send('An error occurred while loading the leaderboard.');
    }
});

// Handle Registration Submission
router.post('/register', userController.createUser);


module.exports = router;
