import express from 'express'
import Course from "../models/course.model.js"
import User from "../models/user.model.js"
var search = express.Router()

search.post('/', async function(req, res) {
    let { keyword, type } = req.body
    let regex = new RegExp(keyword, 'i')
    console.log(`Search`, keyword)
    try {

        let courses = await Course.find({title: { "$regex": regex }})
        let users = await User.find({username: { "$regex": regex }})
        let _users = users.map(u => {
            return {
                username: u.username,
                _id: u._id
            }
        })
        return res.status(200).json({courses, users:_users})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

export default search