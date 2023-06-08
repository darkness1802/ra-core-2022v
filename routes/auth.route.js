import express  from "express"
import AuthController from "../controller/auth.controller.js"
const auth = express.Router()

auth.post("/signin", AuthController.signin)
auth.post("/signup", AuthController.signup)

export default auth