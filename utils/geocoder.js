// importing dotenv here because the env variable call doesn't work
// this is workaround for now
import dotenv from "dotenv"
// Load env variables
dotenv.config({
    path: "./config/config.env",
    quiet: true
})

import NodeGeocoder from "node-geocoder"
if (!process.env.GEOCODER_PROVIDER || !process.env.GEOCODER_PROVIDER) {
    console.warn("⚠️  GEOCODER_API_KEY not found in environment")
    process.exit(1)
}

const options = {
    // provider: "mapquest",
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null, // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

export default geocoder
