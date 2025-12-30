const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: {
        type: String, // mapped from displayName
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    photoURL: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    lastLogin: {
        type: Date
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionType: {
        type: String, // 'monthly', 'quarterly', 'yearly', 'offer'
        default: 'none'
    },
    subscriptionExpiry: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
