const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    coverNote:{
        type: String,
    },
    status:{
        type: String,
        enum: ['pending','seen','accepted','rejected'],
        default: 'pending'
    }
},{timestamps: true})

applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema)