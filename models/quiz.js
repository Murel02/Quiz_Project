const mongoose = require('mongoose');

// Define the Question subdocument schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    yourAnswer: { type: String }, // Track the user's answer
    isCorrect: { type: Boolean }, // Track if the answer was correct
    createdAt: { type: Date, default: Date.now }
});


// Main Quiz schema
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the quiz
    progress: { type: Number, default: 0, required: true }, // Tracks user progress
    questions: {type: [questionSchema], default: []}, // Array of question subdocuments
    createdAt: { type: Date, default: Date.now }, // Quiz creation timestamp
    updatedAt: { type: Date, default: Date.now } // Quiz last updated timestamp
});

module.exports = mongoose.model('Quiz', quizSchema);