const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const Quiz = require('../models/quiz');

// Route to create a question (POST)
router.post('/quiz/create', quizController.createQuestion);

// Route to display the quiz (GET)
router.get('/quiz/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get quiz ID from the URL
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        res.render('quiz', { quiz }); // Pass quiz data to the EJS template
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send('Server error');
    }
});

// Render the frontpage (GET)
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
