import { Router } from "express"

app.get("/api/v1/bootcamps", (req, res) => {
    res.send(200).json({
        success: true,
        message: `Show all bootcamps`,
    })
})

app.get("/api/v1/bootcamps/:id", (req, res) => {
    res.send(200).json({
        success: true,
        message: `show bootcamp :${req.params.id}`,
    })
})

app.post("/api/v1/bootcamps", (req, res) => {
    res.send(201).json({
        success: true,
        message: `create new bootcamp`,
    })
})

app.put("/api/v1/bootcamps/:id", (req, res) => {
    res.send(200).json({
        success: true,
        message: `update bootcamp ${req.params.id}`,
    })
})

app.delete("/api/v1/bootcamps/:id", (req, res) => {
    res.send(202).json({
        success: true,
        message: `delete bootcamp ${req.params.id}`,
    })
})
