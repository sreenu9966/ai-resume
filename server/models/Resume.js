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
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// TTL Index: Automatically delete resumes from database 30 days after soft-delete
resumeSchema.index({ deletedAt: 1 }, {
    expireAfterSeconds: 30 * 24 * 60 * 60, // 30 Days
    partialFilterExpression: { isDeleted: true }
});

module.exports = mongoose.model('Resume', resumeSchema);
