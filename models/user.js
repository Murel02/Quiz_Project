const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define the User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the user (required)
    password: { type: String, required: true }, // Hashed password of the user (required)
    email: { type: String, required: true, unique: true }, // Unique email address for the user (required)
    score: { type: Number, default: 0, required: true }, // User's quiz score, default is 0
});

// Export the User model for use in other parts of the application
module.exports = mongoose.model('User', userSchema);
