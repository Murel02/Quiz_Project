// Route file
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', userController.login);

// Render Register Page
router.get('/register', (req, res) => {
    res.render('createUser'); // Render the `register.ejs` file
});

// Render leaderboard
router.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});

// Handle Registration Submission
router.post('/register', userController.createUser);


module.exports = router;
