const mongoose = require('mongoose');

// Define the Question subdocument schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The actual question
    options: [{ type: String, required: true }], // Array of possible answers
    answer: { type: String, required: true }, // Correct answer
});

// Main Quiz schema
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the quiz
    progress: { type: Number, default: 0, required: true }, // Tracks user progress
    questions: [questionSchema], // Array of question subdocuments
    createdAt: { type: Date, default: Date.now }, // Quiz creation timestamp
    updatedAt: { type: Date, default: Date.now } // Quiz last updated timestamp
});

module.exports = mongoose.model('Quiz', quizSchema);