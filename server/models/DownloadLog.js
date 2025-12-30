const mongoose = require('mongoose');

const downloadLogSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        index: true
    },
    resumeId: String,
    downloadTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DownloadLog', downloadLogSchema);
