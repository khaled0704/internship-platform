const mongoose = require('mongoose');
const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    remote: {
        type: Boolean,
        default: false
    },
    paid:{
        type: Boolean,
        default: false
    },
    salary:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true})
module.exports = mongoose.model('Internship',internshipSchema)