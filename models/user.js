const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    score: {type: Number, default: 0, required: true}
});

module.exports = mongoose.model('User', userSchema);