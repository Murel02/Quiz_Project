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
            res.render('quiz');
        } else {
            return res.status(400).send('Invalid email or password');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

// User list for leaderboard
exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.render('leaderboard', {users});
    } catch(err) {
        console.error("Error getting user information:", err);
        res.status(500).send("Error getting user information.")
    }
};

// Update the user
exports.updateUser = async (req, res) => {
    try{
        await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            score: req.body.score
        });
        res.redirect('/home')
    } catch(err){
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user.");
    }
}