

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = (req, res) => {
    res.status(200).json({
        success: true,
        message: `Show all bootcamps`,
    })
}

// @desc    Get single bootcamps based on id param
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = (req, res) => {
    res.status(200).json({
        success: true,
        message: `Show all bootcamps`,
    })
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
const createBootcamp = (req, res) => {
    res.status(201).json({
        success: true,
        message: `create new bootcamp`,
    })
}

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/
// @access  Private
const updateBootcamp = (req, res) => {
        res.status(200).json({
        success: true,
        message: `update bootcamp ${req.params.id}`,
    })
}

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/
// @access  Private
const deleteBootcamp = (req, res) => {
    res.status(200).json({
        success: true,
        message: `update bootcamp ${req.params.id}`,
    })
}

export { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp }
