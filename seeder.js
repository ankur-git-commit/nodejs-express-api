import dotenv from "dotenv"
import fs from "fs"
import mongoose from "mongoose"
import colors from "colors"
dotenv.config({
    // Load env variables
    path: "./config/config.env",
})
import path from "path"
import { fileURLToPath } from "url"

// Load models
import Bootcamp from "./models/Bootcamp.js"

//Connect to DB
import connectDB from "./config/db.js"
connectDB()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
)

// Import into DB
const importData = async () => {
    try {
        
        await Bootcamp.create(bootcamps)
        console.log(`Data imported to MongoDB...`.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
        process.exit()
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log(`Data deleted in MongoDB...`.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === "-import") {
    importData()
} else if (process.argv[2] === "-delete") {
    deleteData()
}
