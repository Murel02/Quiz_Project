const mongoose = require('mongoose'); // Import Mongoose to define the schema and interact with MongoDB

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name (required field)
    password: { type: String, required: true }, // User's password (required field)
    email: { type: String, required: true }, // User's email address (required field)
    score: { type: Number, default: 0, required: true } // User's score, defaulting to 0 (required field)
});

// Export the User model based on the schema for use in other parts of the application
module.exports = mongoose.model('User', userSchema);
