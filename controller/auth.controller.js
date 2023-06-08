import User from "../models/user.model.js"
import { generateAccess } from "../service/access.service.js"
import { ROLE, PERMISSION } from "../const/role.js"

export default class AuthController {
    static async signup(req, res) {
        const { email, username, password } = req.body

        if (!username || !password || !email) {
            return res.status(404).json({ message: "User not found" })
        }

        try {
            const newUser = await User.create({ email, username, password })
            const access = generateAccess({ id: newUser._id })
            return res.status(200).json({ username, access, role: newUser.role, permission: PERMISSION[newUser.role] })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async signin(req, res) {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(404).json({ message: "User not found" })
        }

        try {
            const user = await User.findOne({ username, password })
            if (user) {
                const access = await generateAccess({ id: user._id })
                return res.status(200).json({ username, access, role: user.role, permission: PERMISSION[user.role] })
            } else return res.status(404).json({ message: "User not found" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}