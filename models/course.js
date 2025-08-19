import mongoose from "mongoose"

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please add a course title"],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
        },
        weeks: {
            type: String,
            required: [true, "Please add number of weeks"],
        },
        tuition: {
            type: Number,
            required: [true, "Please add tution cost"],
        },
        minimumSkill: {
            type: String,
            required: [true, "Please add a minimum skill"],
            enum: ["beginner", "intermediate", "advanced"],
        },
        scholarshipAvailable: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        bootcamp: {
            type: mongoose.Schema.ObjectId,
            ref: "Bootcamp",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$tuition" },
            },
        },
    ])

    try {
        let averageCost = null;
        if (obj.length > 0) {
            averageCost = Math.ceil(obj[0].averageCost / 10) * 10;
        }
        
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: averageCost,
        })
    } catch (error) {
        console.error(error)
    }
}

// Call getAverageCost after save
CourseSchema.post("save", async function () {
    await this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost after deletion
CourseSchema.pre("findOneAndDelete", async function () {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        this._bootcampId = doc.bootcamp;
    }
})

CourseSchema.post("findOneAndDelete", async function () {
    if (this._bootcampId) {
        await this.model.getAverageCost(this._bootcampId);
    }
})

export default mongoose.model("Course", CourseSchema)