const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define the Question subdocument schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // Text of the question
    options: [{ type: String, required: true }], // Array of possible answers
    answer: { type: String, required: true }, // Correct answer to the question
    yourAnswer: { type: String }, // User's selected answer (optional)
    isCorrect: { type: Boolean }, // Indicates if the user's answer was correct (optional)
    createdAt: { type: Date, default: Date.now } // Timestamp for when the question was created
});

// Define the main Quiz schema
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the quiz
    progress: { type: Number, default: 0, required: true }, // Tracks the user's current progress in the quiz
    questions: { type: [questionSchema], default: [] }, // Array of question subdocuments
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the quiz was created
    updatedAt: { type: Date, default: Date.now } // Timestamp for when the quiz was last updated
});

// Export the Quiz model for use in other parts of the application
module.exports = mongoose.model('Quiz', quizSchema);
