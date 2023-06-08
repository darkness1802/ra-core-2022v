import mongoose from "mongoose"

const Schema = mongoose.Schema

const RoomSchema = new Schema({
    host: { type: String, required: true },
    token: { type: String, required: true, unique: true },
}, { timestamps: true })

export default mongoose.model("Room", RoomSchema, "rooms")