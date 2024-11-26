// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model for database operations
const userController = require('../controllers/userController'); // Import the user controller for handling logic

// Route to render the login page
router.get('/login', (req, res) => {
    res.render('login'); // Render the `login.ejs` file
});

// Route to handle login submissions
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    try {
        // Find the user in the database using the provided email
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            // If the user exists and the password matches, send a success message
            return res.send('Login successful!');
        } else {
            // Handle invalid email or password
            return res.status(400).send('Invalid email or password');
        }
    } catch (err) {
        // Log the error and send a server error response
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// Route to render the registration page
router.get('/register', (req, res) => {
    res.render('createUser'); // Render the `createUser.ejs` file
});

// Route to handle registration submissions
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; // Extract name, email, and password from the request body
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If the user exists, send an error message
            return res.status(400).send('User already exists');
        }

        // Use the controller to create a new user
        await userController.createUser({ name, email, password });
        return res.send('Registration successful!'); // Send a success message
    } catch (err) {
        // Log the error and send a server error response
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// Export the router to be used in the main app
module.exports = router;