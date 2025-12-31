const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    ip: String,
    userAgent: String,
    deviceType: String,
    browser: String,
    os: String,
    location: {
        lat: Number,
        lng: Number,
        accuracy: Number,
        timestamp: Date
    },
    privacyAccepted: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '365d' // Keep logs for 1 year
    }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
