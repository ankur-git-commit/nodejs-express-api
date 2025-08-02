import mongoose from "mongoose"

const BootcampSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            unique: true,
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        slug: String,
        description: {
            type: String,
            required: [true, "Please add a description"],
            maxlength: [500, "Name cannot be more than 500 characters"],
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                "Please use a valid URL with HTTP or HTTPS",
            ],
        },
        phone: {
            type: String,
            maxlength: [20, "Phone number cannot be longer than 20 characters"],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        address: {
            type: String,
            required: [true, "Please add an address"],
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
                index: "2dsphere",
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
        },
        careers: {
            // Array of strings
            type: [String],
            required: true,
            enum: [
                "Web Development",
                "Mobile Development",
                "Blockchain",
                "Cybersecurity",
                "AI/Machine Learning",
                "Game Development",
                "Cloud Computing",
                "Data Analytics",
                "Digital Marketing",
                "Project Management",
                "Cloud Architecture",
                "Enterprise Development",
                "Entrepreneurship",
                "Startup Consulting",
                "Advanced Programming",
                "System Design",
                "Software Architecture",
                "Technical Leadership",
                "DevOps",
                "UI/UX",
                "Data Science",
                "Business",
                "Other",
            ],
        },
        averageRating: {
            type: Number,
            min: [1, "Rating must be at least 1"],
            max: [10, "Rating must can not be more than 10"],
        },
        averageCost: Number,
        photo: {
            type: String,
            default: "no-photo.jpg",
        },
        housing: {
            type: Boolean,
            default: false,
        },
        jobAssistance: {
            type: Boolean,
            default: false,
        },
        jobGuarantee: {
            type: Boolean,
            default: false,
        },
        acceptGi: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Bootcamp", BootcampSchema)
