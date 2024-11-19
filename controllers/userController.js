const User = require('../models/user')



exports.createUser = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Create a new user
        const user = new User({ name, password, email });
        await user.save();

        // Redirect to the home page (or another success route)
        res.redirect('/home'); // Make sure you have a route to handle `/home`
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send('An error occurred while creating the user.');
    }
};