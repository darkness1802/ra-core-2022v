import mongoose from "mongoose"

const Schema = mongoose.Schema

const CourseSchema = new Schema({
    title: { type: String, required: true },
    host: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    excriseFile: { type: String, default: "" },

    description: { 
        title: { type: String, default: "" },
        content: { type: String, default: "" }
    },
    videos: { type: Array, default: [] },
    students: { type: Array, default: [] },
    live: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model("Course", CourseSchema, "courses")