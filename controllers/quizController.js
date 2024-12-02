/*
const Quiz = require('../models/quiz');


//Questions for 0-1 class
exports.createQuestion = async(req, res)=>{
    try {
        const x = Math.floor((Math.random() * 25) +1);
        const y = Math.floor((Math.random() * 25) +1);

        const question = `What is ${x} + ${y}?`
        const answer = x + y;

        const options =
        [answer,
            answer + 1,
            answer - 1,
            answer + 2].sort(() => Math.random()- 0.5)

        const newQuiz = new Quiz({
            question: question,
            answer: answer,
            options: options,
        });

        await newQuiz.save();

        res.status(201).json({
            message: 'Quiz question created successfully'
        });
    } catch(error){
        res.status(500).json({
            message: 'Error while creating quiz question',
            error: error.message,
        })
    }
}

 */
const Quiz = require('../models/quiz');

exports.createQuestion = async (req, res) => {
    try {
        const x = Math.floor(Math.random() * 25) + 1;
        const y = Math.floor(Math.random() * 25) + 1;

        const questionText = `What is ${x} + ${y}?`; // Use backticks for template literals
        const correctAnswer = x + y;

        const options = Array.from(new Set([
            correctAnswer,
            correctAnswer + 1,
            correctAnswer - 1,
            correctAnswer + 2,
        ])).sort(() => Math.random() - 0.5);

        // Find or create the quiz
        let quiz = await Quiz.findOne({ title: "Math Quiz for Grade 0-1" });

        if (!quiz) {
            quiz = new Quiz({
                title: "Math Quiz for Grade 0-1",
                progress: 0,
                questions: [],
            });
        }

        // Push the new question to the questions array
        quiz.questions.push({
            question: questionText,
            options: options,
            answer: correctAnswer.toString(),
        });

        // Save the quiz
        await quiz.save();

        res.status(201).json({
            message: 'Quiz question created successfully',
            question: questionText,
            options: options,
        });
    } catch (error) {
        console.error("Error creating quiz question:", error);
        res.status(500).json({
            message: "Error while creating quiz question",
            error: error.message,
        });
    }
};
