const User = require('../models/user'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Function to create a new user
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body; // Extract user details from the request body

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the user's password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided details and hashed password
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save(); // Save the user in the database

        // Redirect to the login page with a success query parameter
        res.redirect('/login?success=1');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Server error'); // Handle server errors
    }
};

// Function to log in a user
exports.login = async (req, res) => {
    const { email, password } = req.body; // Extract login details from the request body

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Validate user credentials
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id; // Store the user's ID in the session
            res.redirect('/home'); // Redirect to the home page
        } else {
            return res.status(400).send('Invalid email or password'); // Handle invalid credentials
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error'); // Handle server errors
    }
};

// Function to log out a user
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/home'); // Redirect to the home page after logging out
    });
};

// Function to retrieve all users for a leaderboard
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render('leaderboard', { users }); // Render the leaderboard view with user data
    } catch (err) {
        console.error("Error getting user information:", err);
        res.status(500).send("Error getting user information."); // Handle errors
    }
};

// Function to update user information
exports.updateUser = async (req, res) => {
    try {
        // Update user details in the database
        await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            score: req.body.score
        });
        res.redirect('/home'); // Redirect to the home page after updating
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user."); // Handle errors
    }
};
