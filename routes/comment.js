const express = require("express");
const {
    createComment
} = require('../controller/comment');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createComment);

module.exports = router;