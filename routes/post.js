const express = require("express");
const {
    getPosts,
    createPost,
    deletePost
} = require('../controller/post');
const router = express.Router();
const Post = require('../model/Post');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

// router.route('/').get(advancedResults(Post, {
//     path: "user",
//     select: "firstname lastname",
// }), protect, getPosts).post(protect, createPost);
router.route('/').get(protect, getPosts).post(protect, createPost);
router.route('/:id').delete(protect, deletePost);

module.exports = router;