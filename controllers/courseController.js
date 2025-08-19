import ErrorResponse from "../utils/errorResponse.js"
import asyncHandler from "../middleware/async.js"
import Course from "../models/Course.js"
import Bootcamp from "../models/Bootcamp.js"
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
