// Route file 
const express = require('express');
const router = express.Router();

const quiz = require('../models/quiz');
const quizController = require('../controllers/quizController')


router.post('/create', quizController.createQuestion);


module.exports = router;