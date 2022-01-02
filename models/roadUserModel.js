const mongoose = require('mongoose');
const validator = require('validator');
const cron = require('node-cron');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Wprowadz swoj adres email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Potwierdz adres email'],
    },
});

const Roaduser = mongoose.model('Roaduser', userSchema);

module.exports = Roaduser;