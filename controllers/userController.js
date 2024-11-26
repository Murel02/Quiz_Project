const User = require('../models/user'); // Import the User model to interact with the database

// Controller function to create a new user
exports.createUser = async (req, res) => {
    const { name, password, email } = req.body; // Extract user details from the request body

    // Validate required fields
    if (!name || !password || !email) {
        return res.status(400).send('All fields are required.'); // Return an error if any field is missing
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.'); // Return an error if the user exists
        }

        // Create a new user document with the provided data
        const user = new User({ name, password, email });
        await user.save(); // Save the new user to the database

        // Redirect to the home page or another success route
        res.redirect('/home'); // Ensure there is a route handling `/home`
    } catch (error) {
        // Log the error and return a server error response
        console.error('Error creating user:', error.message);
        res.status(500).send('An error occurred while creating the user.');
    }
};
