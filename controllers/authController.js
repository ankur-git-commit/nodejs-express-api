import ErrorResponse from "../utils/errorResponse.js"
import asyncHandler from "../middleware/async.js"
import User from "../models/User.js"

// @desc     Register user
// @route    POS T /api/v1/auth/register
// @access   Public
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role,
    })

    sendTokenResponse(user, 200, res)
})

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    // Check for user
    if (!user) {
        return next(new ErrorResponse("Invalid Credentials", 401))
    }

    // check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse("Invalid Credentials", 401))
    }
    sendTokenResponse(user, 200, res)
})

// @desc     Get current logged user
// @route    POST /api/v1/auth/me
// @access   Private
const getMe = asyncHandler(async (req, res, next) => {
    const { id } = req.user

    const user = await User.findById(id)

    res.status(200).json({
        success: true,
        data: user,
    })
})

// Get token from mode, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === "production") {
        options.secure = true
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    })
}

export { register, login, getMe }
