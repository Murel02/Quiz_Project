const mongoose = require('mongoose'); // Import Mongoose library for database modeling

// Define the schema for individual questions in the quiz
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The text of the question
    options: [{ type: String, required: true }], // Array of possible answer options
    answer: { type: String, required: true }, // The correct answer for the question
});

// Define the schema for the quiz
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the quiz
    progress: { type: Number, default: 0, required: true }, // User's progress percentage (default is 0)
    questions: [questionSchema], // Array of questions using the subdocument schema
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the quiz was created
    updatedAt: { type: Date, default: Date.now } // Timestamp for the last time the quiz was updated
});

// Export the Quiz model, which represents the quiz collection in the database
module.exports = mongoose.model('Quiz', quizSchema);
