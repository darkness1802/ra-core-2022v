import express from 'express'
import CourseController from '../controller/course.controller.js'
import middleware from '../middleware.js'

var assignment = express.Router()

assignment.get('/find-assignment', middleware, CourseController.findAssignments)
assignment.post('/add-assignment', middleware, CourseController.addAssignment)
course.post('/update-assignment', middleware, CourseController.updateAssignment)

export default assignment