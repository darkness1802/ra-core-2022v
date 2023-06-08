import mongoose from "mongoose"

const Schema = mongoose.Schema

const AssignmentSchema = new Schema({
    host: { type: String, required: true },
    course: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    progress: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model("Assignment", AssignmentSchema, "assignments")