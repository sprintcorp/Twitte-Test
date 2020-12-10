const Comment = require("../model/Comment");
const asyncHandler = require("../middleware/async");



//@desc  Create new comment
//@route POST /api/v1/comments
//@accss Private
exports.createComment = asyncHandler(async(req, res, next) => {
    //Add user to req,body
    req.body.user = req.user.firstname + " " + req.user.lastname;
    const comment = await Comment.create(req.body);
    res.status(201).json({ success: true, data: comment });
});