const Quiz = require('../models/quiz');

let count = 0;
let questionRoute = "/quiz/create"
let finishedRoute = "/quiz/home"

exports.createQuestion = async (req, res) => {
    try {
        count++

        const questionType = Math.floor(Math.random() * 4);
        let questionText = '';
        let correctAnswer;
        let options = []; // Use let for flexibility

        const x = Math.floor(Math.random() * 25) + 1;
        const y = Math.floor(Math.random() * 25) + 1;

        // Generate question and answer based on type
        switch (questionType) {
            case 0:
                questionText = `What is ${x} + ${y}?`;
                correctAnswer = x + y;
                break;
            case 1:
                questionText = `What is ${x} - ${y}?`;
                correctAnswer = x - y;
                break;
            case 2:
                questionText = `What is ${x} * ${y}?`;
                correctAnswer = x * y;
                break;
            case 3:
                questionText = `Which is higher, ${x} or ${y}?`;
                correctAnswer = x > y ? x : y;
                options.push(x, y);
                break;
            default:
                throw new Error('Invalid question type');
        }

        if (questionType !== 3) {
            options.push(correctAnswer, correctAnswer + 1, correctAnswer - 1);
            options = Array.from(new Set(options)).sort(() => Math.random() - 0.5);
        }

        // Find the quiz and clear all previous questions
        let quiz = await Quiz.findOne({ title: "Math Quiz" });
        if (!quiz) {
            quiz = new Quiz({ title: "Math Quiz", questions: [] });
        } else {
            // Clear all existing questions
            quiz.questions = [];
        }

        // Add the new question
        quiz.questions.push({
            question: questionText,
            options: options,
            answer: correctAnswer.toString(),
        });

        // Save the updated quiz
        await quiz.save();

        // Redirect to the quiz page or render the generated question
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error("Error generating quiz question:", error);
        res.status(500).send("An error occurred while generating the quiz question.");
    }
};
