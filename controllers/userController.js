const User = require('../models/user')
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.render('login')
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            return res.send('Login successful!');
        } else {
            return res.status(400).send('Invalid email or password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};