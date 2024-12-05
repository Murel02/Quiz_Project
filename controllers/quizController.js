// Import required models
const Quiz = require('../models/quiz');
const User = require('../models/user');

// Function to create questions for the quiz
exports.createQuestion = async (req, res) => {
    try {
        // Find an existing quiz with the title "Math Quiz" or create a new one
        let quiz = await Quiz.findOne({ title: 'Math Quiz' });

        if (!quiz) {
            // If no quiz exists, create a new quiz
            quiz = new Quiz({ title: 'Math Quiz', questions: [] });
        } else {
            // If the quiz exists, reset progress and clear old questions
            quiz.progress = 0;
            quiz.questions = [];
        }

        // Helper function to generate a single question
        const generateSingleQuestion = () => {
            const questionType = Math.floor(Math.random() * 4); // Randomly select question type
            let questionText = ''; // The question text
            let correctAnswer; // Correct answer for the question
            let options = []; // Answer options

            // Generate random numbers for the question
            const x = Math.floor(Math.random() * 25) + 1;
            const y = Math.floor(Math.random() * 25) + 1;

            // Create question based on the selected type
            switch (questionType) {
                case 0: // Addition question
                    questionText = `What is ${x} + ${y}?`;
                    correctAnswer = x + y;
                    break;
                case 1: // Subtraction question
                    questionText = `What is ${x} - ${y}?`;
                    correctAnswer = x - y;
                    break;
                case 2: // Multiplication question
                    questionText = `What is ${x} * ${y}?`;
                    correctAnswer = x * y;
                    break;
                case 3: // Comparison question
                    questionText = `Which is higher, ${x} or ${y}?`;
                    correctAnswer = x > y ? x : y;
                    options.push(x.toString(), y.toString());
                    break;
                default:
                    throw new Error('Invalid question type'); // Handle unexpected case
            }

            // Generate answer options for math-based questions
            if (questionType !== 3) {
                options.push(correctAnswer.toString(), (correctAnswer + 1).toString(), (correctAnswer - 1).toString());
                options = Array.from(new Set(options)).sort(() => Math.random() - 0.5); // Shuffle and remove duplicates
            }

            return {
                question: questionText, // The generated question text
                options: options, // The answer options
                answer: correctAnswer.toString(), // The correct answer as a string
                createdAt: new Date(), // Timestamp for sorting later
            };
        };

        // Generate 10 questions and add them to the quiz
        const newQuestions = Array.from({ length: 10 }, generateSingleQuestion);
        quiz.questions = [...quiz.questions, ...newQuestions]; // Append generated questions

        console.log('Generated Questions:', newQuestions);

        // Save the updated quiz
        await quiz.save();

        // Redirect to the quiz page
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        res.status(500).send('An error occurred while generating the quiz questions.');
    }
};

// Function to handle submitted answers
exports.submitAnswer = async (req, res) => {
    try {
        const { id } = req.params; // Quiz ID from the route
        const { selectedAnswer } = req.body; // Answer submitted by the user

        // Find the quiz by ID
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        // Sort questions by creation time to ensure proper order
        const sortedQuestions = quiz.questions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const currentIndex = quiz.progress; // Get the current question index
        if (currentIndex >= sortedQuestions.length) {
            return res.status(400).send('Invalid question index.');
        }

        // Get the current question
        const currentQuestion = sortedQuestions[currentIndex];

        if (!selectedAnswer) {
            return res.status(400).send('Answer is required.');
        }

        // Check if the submitted answer is correct
        const isCorrect = currentQuestion.answer === selectedAnswer;

        // Save the submitted answer and correctness
        quiz.questions[currentIndex].yourAnswer = selectedAnswer;
        quiz.questions[currentIndex].isCorrect = isCorrect;

        console.log('Submitted answer:', selectedAnswer);
        console.log('Correct answer:', currentQuestion.answer);
        console.log('Is correct:', isCorrect);

        // Update quiz progress
        quiz.progress += 1;

        // Save the updated quiz
        await quiz.save();

        // If all questions are answered, calculate the score
        if (quiz.progress >= sortedQuestions.length) {
            const totalCorrect = sortedQuestions.filter(q => q.isCorrect).length;

            // Update the user's score if logged in
            if (req.session.userId) {
                const user = await User.findById(req.session.userId);
                if (user) {
                    user.score += totalCorrect; // Add points for correct answers
                    await user.save();
                }
            }

            // Render the quiz-finished page with the results
            return res.render('quiz-finished', {
                quiz: sortedQuestions,
                totalCorrect,
                totalQuestions: sortedQuestions.length,
            });
        }

        // Redirect to the next question
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).send('Server error');
    }
};
