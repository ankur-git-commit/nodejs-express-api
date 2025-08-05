import ErrorResponse from "../utils/errorResponse.js"
import asyncHandler from "../middleware/async.js"
import Course from "../models/Course.js"
import mongoose from "mongoose"
mongoose.set("debug", true)

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
    let query
    // console.log(req.params)
    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId,
        })
    } else {
        query = Course.find().populate({
            path: "bootcamp",
            select: "name description",
        })
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    })
})

export { getCourses }
