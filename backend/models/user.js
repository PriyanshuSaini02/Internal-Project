const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    dob: {
        type: Date,
        required: true
    },
    userManager:{
        type: Date,
        required: true
    },
    project:{
        type: [String], 
        required: true
    },
    address:{
        type:String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', userSchema);