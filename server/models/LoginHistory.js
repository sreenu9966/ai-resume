const mongoose = require('mongoose');

const loginHistorySchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        index: true
    },
    ipAddress: String,
    device: String, // e.g., "Chrome on Windows"
    loginTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
