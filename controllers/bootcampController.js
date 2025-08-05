import asyncHandler from "../middleware/async.js"
import ErrorResponse from "../utils/errorResponse.js"
import Bootcamp from "../models/Bootcamp.js"
import Course from "../models/Course.js"
import geocoder from "../utils/geocoder.js"
import mongoose from "mongoose"
mongoose.set("debug", true)

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query }
    console.log(reqQuery)

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => {
        delete reqQuery[param]
    })

    // console.log(reqQuery);
    // Extract all fields that use [in]
    const inQueries = {}
    Object.keys(reqQuery).forEach((key) => {
        const match = key.match(/^(.+)\[in\]$/)
        if (match) {
            inQueries[match[1]] = reqQuery[key]
                .split(",")
                .map((str) => str.trim())
            delete reqQuery[key]
        }
    })

    // Stringify, replace, and parse the rest (for gt, gte, etc)
    let queryStr = JSON.stringify(reqQuery)

    // Create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

    let queryObj = JSON.parse(queryStr)

    // 4. Merge in your $in queries
    Object.keys(inQueries).forEach((field) => {
        queryObj[field] = { $in: inQueries[field] }
    })

    let query = Bootcamp.find(queryObj).populate("courses")

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ")
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort("-createdAt")
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    console.log(page, limit)

    query = query.skip(startIndex).limit(limit)

    // Execute the query
    const bootcamps = await query

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit,
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit,
        }
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination: pagination,
        data: bootcamps,
    })
})

// @desc    Get single bootcamps based on id param
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const getBootcampData = await Bootcamp.findById(id)

    if (!getBootcampData) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${id}`, 404)
        )
    }
    res.status(200).json({
        success: true,
        data: getBootcampData,
    })
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp,
    })
})

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!bootcamp) {
        return res.status(404).json({
            success: false,
            message: `item not found`,
        })
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    })
})

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const bootcamp = await Bootcamp.findById(id)

    if (!bootcamp) {
        return res.status(404).json({
            success: false,
            message: `item not found`,
        })
    }

    // Manually delete courses since .remove() in mongoose is deprecated
    await Course.deleteMany({ bootcamp: bootcamp._id })

    // Delete bootcamp
    await Bootcamp.deleteOne({ _id: id })

    res.status(200).json({
        success: true,
        data: bootcamp,
    })
})

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius?zipcode={zipcode}&distance={distance}
// @access  Public
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    // console.log(req.query);
    const { zipcode, distance } = req.query

    // Get latitude and longitude from geocoder
    const location = await geocoder.geocode(zipcode)
    const latitude = location[0].latitude
    const longitude = location[0].longitude

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Radius of earth = 3,963 miles / 6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius],
            },
        },
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    })
})

export {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
}
