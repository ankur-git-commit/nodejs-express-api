import dotenv from "dotenv"
dotenv.config({
    path: "./config/config.env",
})
import express from "express"
import connectDB from "./config/db.js"
import colors from "colors"
import morgan from "morgan"
import { bootcampsRouter } from "./routes/bootcampsRoutes.js"
import { coursesRouter } from "./routes/coursesRoutes.js"
import errorHandler from "./middleware/error.js"
import "./utils/geocoder.js"
// import logger from "./middleware/logger.js"

connectDB()

const app = express()
const PORT = process.env.PORT || 3000

// body parser
app.use(express.json()) // for parsing body, application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    // app.use(logger)
    app.use(morgan("dev"))
}

// Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter)
app.use("/api/v1/courses", coursesRouter)

// custom error handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(
        `Server is running in ${process.env.NODE_ENV} at port: ${PORT}`.bgGreen
            .brightBlue.bold
    )
})
