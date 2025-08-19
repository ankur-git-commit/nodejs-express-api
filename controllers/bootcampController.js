import asyncHandler from "../middleware/async.js"
import ErrorResponse from "../utils/errorResponse.js"
import Bootcamp from "../models/Bootcamp.js"
import Course from "../models/Course.js"
import geocoder from "../utils/geocoder.js"
import path from "path"
import mongoose from "mongoose"
// mongoose.set("debug", true)

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
    console.log(res.advancedResults)

    res.status(200).json(res.advancedResults)
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

//@desc     Upload photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const bootcamp = await Bootcamp.findById(id)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with the id of ${id}`, 404)
        )
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400))
    }

    const file = req.files.file

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse("Please upload an image file", 400))
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD_SIZE}`,
                400
            )
        )
    }

    // Create custom file name
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`
    console.log(file)
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.err(err)
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

        await Bootcamp.findByIdAndUpdate(id, { photo: file.name })

        res.status(200).json({
            success: true,
            message: "file uploaded",
            data: file.name,
        })
    })
})

export {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
}
