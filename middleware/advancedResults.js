const advancedResults = (model, populate) => async (req, res, next) => {
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

    let query = model.find(queryObj)

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
    const total = await model.countDocuments()

    // console.log(page, limit)

    query = query.skip(startIndex).limit(limit)

    if (populate){
        query = query.populate(populate)
    }

    // Execute the query
    const results = await query

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

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    }

    next()
}

export default advancedResults
