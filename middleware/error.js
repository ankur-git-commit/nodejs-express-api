import ErrorResponse from "../utils/errorResponse.js"

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    // console.log(Object.keys(err.errors))
    // console.log(Object.values(err.errors))
    // console.log(Object.keys(err))
    // console.log(err.reason)
    // console.log(err.errors)
    // console.log(err.name)
    console.log(error)
    // console.log(error);
    error.message = err.message
    // Log to console for dev
    // console.log(err.stack.red)

    // console.log(err.name)

    // Mongoose Bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ")
        error = new ErrorResponse(message, 400)
    }

    // Mongoose Duplicate Field
    if (err.code === 11000) {
        const duplicateFields = Object.entries(err.keyValue)
            .map(([key, value]) => `${key} - ${value}`)
            .join(", ")
        const message = `Duplicate value(s) entered: ${duplicateFields}`
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: `this is a custom error handler`,
        error: error.message || "Server Error",
    })
}

export default errorHandler
