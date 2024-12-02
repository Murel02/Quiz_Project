// Route file 
const express = require('express');
const router = express.Router();

const quiz = require('../models/quiz');
const quizController = require('../controllers/quizController')


// Get Quiz Page
router.get('/quiz/:quizId', async (req, res) => {
    res.render('quiz');
});

router.get('/quiz', quizController.createQuestion)

router.get('/quiz', (req, res) => {
    res.render('createUser'); // Render the `register.ejs` file
});

// Render frontpage
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;