const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({

    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Like', LikeSchema);