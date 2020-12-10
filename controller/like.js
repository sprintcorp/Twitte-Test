const Like = require("../model/Like");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");



//@desc  Create new post
//@route POST /api/v1/likes
//@accss Private
exports.createLike = asyncHandler(async(req, res, next) => {
    //Add user to req,body
    req.body.user = req.user.id;
    const like_check = await Like.find({
        $and: [{
            "post": req.body.post,
            "user": req.user.id
        }]
    });
    console.log(like_check);
    if (like_check.length > 0) {

        await Like.findByIdAndDelete(like_check[0]._id);
        res.status(201).json({ success: true, data: "post unlike" });
    } else {
        const like = await Like.create(req.body);
        res.status(201).json({ success: true, data: like });
    }
});

//@desc  Create new post
//@route GET /api/v1/likes
//@accss Private
exports.getLike = asyncHandler(async(req, res, next) => {
    //Add user to req,body
    // req.body.user = req.user.id;
    const post = req.query.post;
    const user = req.user.id
    console.log(post)
    const like_check = await Like.findOne({
        post: post,
        user: user
    });
    // console.log(like_check)
    res.status(200).json({ success: true, data: like_check });
});