import NodeGeocoder from "node-geocoder"

const options = {
    provider: "mapquest",
    httpAdapter: 'https',
    apiKey: "CNJIFHvRv5UVxRfOjIjtquww3K3Cbx3g", // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null, // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

export default geocoder
