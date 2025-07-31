import express from "express"
import dotenv from "dotenv"
import { bootcampsRouter } from "./routes/bootcampsRoutes.js"

dotenv.config({
    path: "./config/config.env",
})

const app = express()
const PORT = process.env.PORT || 3000

const data = { name: "John", age: 30 }

app.use("/api/v1/bootcamps", bootcampsRouter)

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} at port: ${PORT}`)
})
