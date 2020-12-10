const Post = require("../model/Post");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// const path = require('path');


//@desc Get all posts
//@route GET /api/v1/posts
//@accss Public
exports.getPosts = asyncHandler(async(req, res, next) => {

    // res.status(200).json(res.advancedResults);
    const post = await Post.find().populate('comments').populate({
        path: "user",
        select: "firstname lastname",
    }).populate('likes').sort({ createdAt: 'descending' });
    res.status(200).json({ success: true, data: post });
});


//@desc  Create new post
//@route POST /api/v1/posts
//@accss Private
exports.createPost = asyncHandler(async(req, res, next) => {
    //Add user to req,body
    req.body.user = req.user.id;
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
});




//@desc Delete posts
//@route DELETE /api/v1/posts/:id
//@accss Private
exports.deletePost = asyncHandler(async(req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(
            new ErrorResponse(`post not found with id of ${req.params.id}`, 404)
        );
    }
    // Chech if post belongs to user before deleting
    console.log("user1 " + req.user.id)
    console.log("user2 " + post.user._id)
    if (req.user.id != post.user._id) {
        return next(
            new ErrorResponse(`User is not authoried to delete post`, 403)
        );
    }

    if (await Post.findByIdAndDelete(req.params.id)) {
        res.status(200).json({ success: true, data: "post Successfully deleted" });
    }
});