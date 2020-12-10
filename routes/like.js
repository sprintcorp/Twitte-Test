const express = require("express");
const {
    createLike,
    getLike

} = require('../controller/like');
const router = express.Router();
const { protect } = require('../middleware/auth');
router.route('/').post(protect, createLike).get(protect, getLike);

module.exports = router;