import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import { bootcampsRouter } from "./routes/bootcampsRoutes.js"
import morgan from "morgan"
// import logger from "./middleware/logger.js"

dotenv.config({
    path: "./config/config.env",
})
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    // app.use(logger)
    app.use(morgan("dev"))
}

app.use("/api/v1/bootcamps", bootcampsRouter)

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} at port: ${PORT}`)
})
