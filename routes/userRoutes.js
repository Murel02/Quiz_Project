// Route file
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle Login Submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            // Redirect or send success message
            return res.send('Login successful!');
        } else {
            // Handle invalid credentials
            return res.status(400).send('Invalid email or password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// Render Register Page
router.get('/register', (req, res) => {
    res.render('createUser'); // Render the `register.ejs` file
});

// Handle Registration Submission
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Create a new user using the controller
        await userController.createUser({ name, email, password });
        return res.send('Registration successful!');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
