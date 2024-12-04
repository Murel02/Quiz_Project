const Quiz = require('../models/quiz');
const User = require('../models/user');


let count = 0;
let questionRoute = "/quiz/create"
let finishedRoute = "/quiz/home"

exports.createQuestion = async (req, res) => {
    try {
        // Find or create a new quiz
        let quiz = await Quiz.findOne({ title: 'Math Quiz' });

        if (!quiz) {
            quiz = new Quiz({ title: 'Math Quiz', questions: [] });
        } else {
            // Reset progress and clear old questions
            quiz.progress = 0;
            quiz.questions = [];
        }

        // Generate new questions
        const generateSingleQuestion = () => {
            const questionType = Math.floor(Math.random() * 4);
            let questionText = '';
            let correctAnswer;
            let options = [];

            const x = Math.floor(Math.random() * 25) + 1;
            const y = Math.floor(Math.random() * 25) + 1;

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
                    options.push(x.toString(), y.toString());
                    break;
                default:
                    throw new Error('Invalid question type');
            }

            if (questionType !== 3) {
                options.push(correctAnswer.toString(), (correctAnswer + 1).toString(), (correctAnswer - 1).toString());
                options = Array.from(new Set(options)).sort(() => Math.random() - 0.5);
            }

            return {
                question: questionText,
                options: options,
                answer: correctAnswer.toString(),
                createdAt: new Date(),
            };
        };

        // Generate 10 questions and add them to the quiz
        const newQuestions = Array.from({ length: 10 }, generateSingleQuestion);
        quiz.questions = [...quiz.questions, ...newQuestions];

        console.log('Generated Questions:', newQuestions);

        await quiz.save();
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        res.status(500).send('An error occurred while generating the quiz questions.');
    }
};




exports.submitAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedAnswer } = req.body;

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        // Sort questions to ensure correct order
        const sortedQuestions = quiz.questions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const currentIndex = quiz.progress;
        if (currentIndex >= sortedQuestions.length) {
            return res.status(400).send('Invalid question index.');
        }

        // Get the current question
        const currentQuestion = sortedQuestions[currentIndex];

        if (!selectedAnswer) {
            return res.status(400).send('Answer is required.');
        }

        const isCorrect = currentQuestion.answer === selectedAnswer;

        // Update `yourAnswer` and `isCorrect` for the current question
        quiz.questions[currentIndex].yourAnswer = selectedAnswer;
        quiz.questions[currentIndex].isCorrect = isCorrect;

        console.log('Submitted answer:', selectedAnswer);
        console.log('Correct answer:', currentQuestion.answer);
        console.log('Is correct:', isCorrect);

        // Update progress
        quiz.progress += 1;

        // Save the updated quiz
        console.log('Before Saving:', JSON.stringify(quiz.questions, null, 2));
        await quiz.save();
        console.log('After Saving:', JSON.stringify(quiz.questions, null, 2));

        // If all questions are answered, calculate the score
        if (quiz.progress >= sortedQuestions.length) {
            const totalCorrect = sortedQuestions.filter(q => q.isCorrect).length;

            // Update user's score if logged in
            if (req.session.userId) {
                const user = await User.findById(req.session.userId);
                if (user) {
                    user.score += totalCorrect; // Add points for correct answers
                    await user.save();
                }
            }

            // Render the results page with the final data
            return res.render('quiz-finished', {
                quiz: sortedQuestions,
                totalCorrect,
                totalQuestions: sortedQuestions.length
            });
        }

        // Redirect to the next question
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).send('Server error');
    }
};



