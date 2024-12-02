require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const quizRoutes = require('./routes/quizRoutes')


const app = express();
app.use(express.urlencoded({ extended: true })); // Handles form submissions
app.use(express.json()); // Handles JSON payloads
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect(process.env.DB_URI, {
}) .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error"));


app.use('/', userRoutes);
app.use('/', quizRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})