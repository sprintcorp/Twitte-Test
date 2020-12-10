const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/mail");
const _ = require("underscore");
const fs = require("fs");
const crypto = require('crypto');
const { random } = require("underscore");

//@desc Register user
//@route POST /api/v1/auth/register
//@accss Public
exports.register = asyncHandler(async(req, res, next) => {

    const { firstname, lastname, email, password } = req.body;

    console.log(req.body);
    //Create user
    const user = await User.create({ firstname, lastname, email, password });
    const message = `wELCOME TO TWITEE ${firstname} ${lastname}`;
    sendMail(user, message);

    sendTokenResponse(user, 200, res);

});

//@desc Login user
//@route POST /api/v1/auth/login
//@accss Public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('please provide an email and password', 400))
    }
    //Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //Check if password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res);

});


// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});



//@desc  Get Current Logged in User
//@route GET /api/v1/auth/me
//@accss private
exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
});



const sendMail = async(user, message) => {
    try {
        await sendEmail({
            email: user.email,
            subject: 'Welcome Email',
            message: message
        });
        // res.status(200).json({
        //     success: true,
        //     data: 'Email sent'
        // })
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse(`Email could not be sent`, 500))
    }
}


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            firstname: user.firstname,
            image: user.image,
            lastname: user.lastname,
            email: user.email,
            id: user._id,
            role: user.role
        })

}