const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const quizController = require('../controllers/quizController'); // Import the quiz controller
const Quiz = require('../models/quiz'); // Import the Quiz model
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Route to create a new question for a quiz (POST request)
// Requires authentication to ensure only authorized users can create questions
router.post('/quiz/create', authMiddleware, quizController.createQuestion);

// Route to render the quiz creation form (GET request)
// Uses authentication middleware to restrict access
router.get('/quiz/create-form', authMiddleware, (req, res) => {
    res.render('quiz'); // Render the "quiz" form template
});

// Route to fetch and display a quiz by its ID (GET request)
// Includes authentication to ensure only authorized users can access quizzes
router.get('/quiz/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params; // Extract the quiz ID from the URL
        const quiz = await Quiz.findById(id); // Find the quiz in the database by ID

        if (!quiz) {
            // Return a 404 error if the quiz does not exist
            return res.status(404).send('Quiz not found');
        }

        const currentIndex = quiz.progress; // Get the user's current progress in the quiz
        const currentQuestion = quiz.questions[currentIndex]; // Get the current question

        // Render the quiz template, passing the quiz, current question, and progress
        res.render('quiz', {
            quiz,
            question: currentQuestion,
            questionIndex: currentIndex,
        });
    } catch (error) {
        // Handle any server errors during the process
        console.error('Error fetching quiz:', error);
        res.status(500).send('Server error');
    }
});

// Route to submit an answer to a quiz question (POST request)
// Handles authentication to ensure only authorized users can submit answers
router.post('/quiz/:id/submit', authMiddleware, quizController.submitAnswer);

// Route to render the front page of the application (GET request)
// No authentication required for accessing the home page
router.get('/home', (req, res) => {
    res.render('home'); // Render the "home" template
});

// Export the router to make it available for use in other files
module.exports = router;