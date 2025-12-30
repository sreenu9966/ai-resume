const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        default: 'Untitled Resume'
    },
    data: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
