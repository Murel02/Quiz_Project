// Route file 
const express = require('express');
const router = express.Router();

const quiz = require('../models/quiz');
const quizController = require('../controllers/quizController')




router.get('/quiz', quizController.createQuestion)

router.get('/quiz', (req, res) => {
    res.render('createUser'); // Render the `register.ejs` file
});

module.exports = router;