const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        required: true,
        enum: ['student', 'company','admin']
    },
    verified:{
        type: Boolean,
        default: false
    },
    university: String,
    fieldOfStudy: String,
    cvUrl: String,
    companyName: String,
    sector: String,
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)