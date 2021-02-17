
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

const sendEmail = require('../utils/sendEmail')






exports.register = async (req, res, next) => {

    const { username, email, password } = req.body
    try {
        const user = await User.create({
            username, email, password
        });
        sendToken(user, 201, res)

    } catch (error) {
        next(error)
    }

}

exports.login = async (req, res, next) => {

    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    try {
        const user = await User.findOne({ email }).select('+password')


        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401))

        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))


        }
        sendToken(user, 200, res)


    } catch (error) {
        next(error)
    }

}

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return next(new ErrorResponse("Email couldnot be sent"), 404)
        }
        const resetToken = user.getResetPasswordToken()
        await user.save();
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `<h1> You have requested a new password reset</h1>
        <p>Please go to this link for reset</p>
        <a href = ${resetUrl} clicktracking = off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: "password reset request",
                text: message
            });

            res.status(200).json({ success: true, data: "Email send" })

        } catch (err) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()
            return next(new ErrorResponse("Email couldnot be send", 500))

        }
    } catch (err) {
        next(err)
    }
}

exports.resetPassword = (req, res, next) => {
    res.send("resetPassword Route")
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}