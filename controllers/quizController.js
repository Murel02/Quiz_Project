
const Quiz = require('../models/quiz');

exports.createQuestion = async (req, res) => {
    try {
        const questionType = Math.floor(Math.random() * 3);
        let questionText = '';
        let correctAnswer;
        const options = [];

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
            default:
                throw new Error('Invalid question type');
        }

        options.push(correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2);
        const uniqueOptions = Array.from(new Set(options)).sort(() => Math.random() - 0.5);

        // Save to database
        let quiz = await Quiz.findOne({ title: "Math Quiz" });
        if (!quiz) {
            quiz = new Quiz({ title: "Math Quiz", questions: [] });
        }
        quiz.questions.push({ question: questionText, options: uniqueOptions, answer: correctAnswer.toString() });
        await quiz.save();

        // Redirect to the quiz page or render the generated question
        res.redirect(`/quiz/${quiz._id}`);
    } catch (error) {
        console.error("Error generating quiz question:", error);
        res.status(500).send("An error occurred while generating the quiz question.");
    }
};

/*

       /* const options = Array.from(new Set([
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
};*/
