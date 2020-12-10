const mongoose = require('mongoose');
// const House = require("./House");

const CommentSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, );



// CommentSchema.virtual('houses', {
//     ref: 'House',
//     localField: '_id',
//     foreignField: 'category',
//     justOne: false
// });

module.exports = mongoose.model('Comment', CommentSchema);