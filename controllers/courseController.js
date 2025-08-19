import ErrorResponse from "../utils/errorResponse.js"
import asyncHandler from "../middleware/async.js"
import Course from "../models/Course.js"
import Bootcamp from "../models/Bootcamp.js"
import mongoose from "mongoose"
// mongoose.set("debug", true)

// @desc    Get all courses or Get courses for bootcamp
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
    // console.log(req.params)
    if (req.params.bootcampId) {
        const course = await Course.find({
            bootcamp: req.params.bootcampId,
        })
        res.status(200).json({
        success: true,
        count: course.length,
        data: course,
    })
    } else {
        res.status(200).json(res.advancedResults)
    }

})
// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const course = await Course.findById(id).populate({
        path: "bootcamp",
        select: "name description",
    })

    if (!course) {
        return next(
            new ErrorResponse(`Course not found with the id: ${id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc    Create new course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
const addCourse = asyncHandler(async (req, res, next) => {
    console.log("test")
    req.body.bootcamp = req.params.bootcampId
    const bootcampIdData = req.body.bootcamp

    const bootcamp = await Bootcamp.findById(bootcampIdData)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp with the id of ${bootcampIdData}`)
        )
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const course = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!course) {
        return next(new ErrorResponse(`Course with ${id} couldn't be update`))
    }
    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const course = await Course.findByIdAndDelete(id)

    if (!course) {
        return next(new ErrorResponse(`Course with ${id} couldn't be update`))
    }
    res.status(200).json({
        success: true,
        data: [],
    })
})

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse }
