import Bootcamp from "../models/Bootcamp.js"

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getAllBootcamps = async (req, res) => {
    try {
        const getAllBootcamps = await Bootcamp.find()

        res.status(200).json({
            success: true,
            count: getAllBootcamps.length,
            data: getAllBootcamps,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `${error.message}`,
        })
    }
}

// @desc    Get single bootcamps based on id param
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = async (req, res) => {
    try {
        const { id } = req.params
        const getBootcampData = await Bootcamp.findById(id)

        if (!getBootcampData) {
            return res.status(404).json({
                success: false,
            })
        }

        res.status(200).json({
            success: true,
            data: getBootcampData,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `${error.message}`,
        })
    }
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
const createBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `${error.message}`,
        })
    }
}

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
const updateBootcamp = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `${error.message}`,
        })
    }
}

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp = async (req, res) => {
    try {
        const { id } = req.params

        const bootcamp = await Bootcamp.findByIdAndDelete(id)

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
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `${error.message}`,
        })
    }
}

export {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
}
