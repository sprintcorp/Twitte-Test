const mongoose = require('mongoose');
// const Comment = require("./Comment");

const PostSchema = new mongoose.Schema({

    post: {
        type: String,
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

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, );

//Cascade delete houses when a category is deleted
PostSchema.pre('remove', async function(next) {
    console.log(`Houses being removed from category ${this._id}`);
    await House.deleteMany({ category: this._id });
    next();
});

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

PostSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    justOne: false
});

module.exports = mongoose.model('Post', PostSchema);