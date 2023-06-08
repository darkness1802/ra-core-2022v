import mongoose from "mongoose"

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['NORMAL', 'TEACHER', 'ADMIN'], default: 'NORMAL' },
    library: { type: Array, default: [] }
}, { timestamps: true })

export default mongoose.model("User", UserSchema, "users")