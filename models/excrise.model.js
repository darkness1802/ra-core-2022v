import mongoose from "mongoose"

const Schema = mongoose.Schema

const ExcriseSchema = new Schema({
    genre: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    courseId: { type: Schema.Types.ObjectId, required: true },
    limit: { type: Date },
    file: { type: String, default: "" },
    status: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model("Excrise", ExcriseSchema, "excrises")