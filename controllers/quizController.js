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
            message: 'Quiz question created succesfully'
        });
    } catch(error){
        res.status(500).json({
            message: 'Error while creating quiz question',
            error: error.message,
        })
    }
}