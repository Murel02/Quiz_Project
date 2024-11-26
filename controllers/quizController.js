const Quiz = require('../models/quiz'); // Import the Quiz model

// Function to create a math question for a quiz (targeted at 0-1 class level)
exports.createQuestion = async (req, res) => {
    try {
        // Generate two random numbers between 1 and 25
        const x = Math.floor((Math.random() * 25) + 1);
        const y = Math.floor((Math.random() * 25) + 1);

        // Create the question text and calculate the correct answer
        const question = `What is ${x} + ${y}?`; // E.g., "What is 5 + 7?"
        const answer = x + y; // The correct answer (e.g., 12)

        // Generate multiple-choice options, including the correct answer
        const options = [
            answer,               // Correct answer
            answer + 1,           // Slightly incorrect option
            answer - 1,           // Slightly incorrect option
            answer + 2            // Slightly incorrect option
        ].sort(() => Math.random() - 0.5); // Shuffle the options randomly

        // Create a new quiz document using the Quiz model
        const newQuiz = new Quiz({
            question: question,   // The generated question
            answer: answer,       // The correct answer
            options: options,     // Shuffled answer options
        });

        // Save the new quiz question to the database
        await newQuiz.save();

        // Send a success response
        res.status(201).json({
            message: 'Quiz question created successfully'
        });
    } catch (error) {
        // Handle errors and send a failure response
        res.status(500).json({
            message: 'Error while creating quiz question',
            error: error.message, // Include the error details in the response
        });
    }
};
