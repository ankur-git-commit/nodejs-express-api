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
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
    const bootcampIdData = req.body.bootcamp

    let bootcamp

    // Check for the bootcamp and if the req.user.id matches the user in the DB
    if (req.user.role === "admin") {
        // Admin can add course to any bootcamp
        bootcamp = await Bootcamp.findById(bootcampIdData)
    } else {
        // Non-admin can only add course to their own bootcamp
        bootcamp = await Bootcamp.findOne({
            _id: bootcampIdData,
            user: req.user.id,
        })

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `User with the ${bootcampIdData} unauthorized to add a course`,
                    403
                )
            )
        }
    }

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No bootcamp with the id of ${bootcampIdData}`,
                404
            )
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
    let course

    if (req.user.role === "admin") {
        // Admin can update any course
        course = await Course.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
    } else {
        // Non-admin can only update courses from their own bootcamp
        // First find the course and populate bootcamp to check ownership
        const existingCourse = await Course.findById(id).populate("bootcamp")

        if (!existingCourse) {
            return next(new ErrorResponse(`Course with ${id} not found`, 404))
        }

        // Check if user owns the bootcamp that this course belongs to
        if (existingCourse.bootcamp.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(
                    `User with the ${id} unauthorized to update the course`,
                    403
                )
            )
        }

        // User is authorized, proceed with update
        course = await Course.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
    }

    if (!course) {
        return next(new ErrorResponse(`Course with ${id} not found`, 404))
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
    let course

    if (req.user.role === "admin") {
        // Admin can delete any course
        course = await Course.findByIdAndDelete(id)
    } else {
        // Non-admin can only delete courses from their own bootcamp
        // First find the course and populate bootcamp to check ownership
        const existingCourse = await Course.findById(id).populate("bootcamp")

        if (!existingCourse) {
            return next(new ErrorResponse(`Course with ${id} not found`, 404))
        }

        // Check if user owns the bootcamp that this course belongs to
        if (existingCourse.bootcamp.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(
                    `User with the ${id} unauthorized to delete the course`,
                    403
                )
            )
        }

        // User is authorized, proceed with deletion
        course = await Course.findByIdAndDelete(id)
    }

    if (!course) {
        return next(new ErrorResponse(`Course with ${id} not found`, 404))
    }

    res.status(200).json({
        success: true,
        data: {},
    })
})

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse }
