require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')


const app = express();
app.use(express.urlencoded({ extended: true })); // Handles form submissions
app.use(express.json()); // Handles JSON payloads
app.set('view engine', 'ejs');


mongoose.connect(process.env.DB_URI, {
}) .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error"));


app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})