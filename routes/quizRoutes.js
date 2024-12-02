const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const Quiz = require('../models/quiz');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a question (POST)
router.post('/quiz/create', authMiddleware, quizController.createQuestion);

router.get('/quiz/create-form', authMiddleware, (req, res) => {
    res.render('quiz'); // Render the form template
});


router.get('/quiz/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        res.render('quiz', { quiz }); // Pass the quiz data to the EJS template
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send('Server error');
    }
});


// Render the frontpage (GET)
router.get('/home', (req, res) => {
    res.render('home');
});

// Render leaderboard
router.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});

module.exports = router;
