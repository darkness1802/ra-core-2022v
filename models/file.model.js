import mongoose from "mongoose"

const Schema = mongoose.Schema

const FileSchema = new Schema({
    fileName: { type: String, required: true },
    downloadLink: { type: String, required: true },
}, { timestamps: true, collection: 'files' })

export default mongoose.model("File", FileSchema)