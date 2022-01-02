const mongoose = require('mongoose');
const validator = require('validator');
const cron = require('node-cron');

const roadUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Wprowadz swoj adres email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Potwierdz adres email'],
    },
    drogi: {
        type: Array,
    },
    odcinki: {
        type: Array,
    },
    wojewodztwa: {
        type: Array,
    },

});

const Roaduser = mongoose.model('Roaduser', roadUserSchema);

module.exports = Roaduser;