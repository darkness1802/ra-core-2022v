import express from 'express'
import CourseController from '../controller/course.controller.js'
import middleware from '../middleware.js'

var course = express.Router()

course.get('/', middleware, CourseController.getCourses)
course.get('/info', CourseController.courseInfo)
course.get(`/latest`, CourseController.latestCourses)
course.get('/popular', CourseController.popularCourses)
course.post('/create', middleware, CourseController.createCourse)
course.post('/delete', middleware, CourseController.deleteCourse)
course.post('/update-description', middleware, CourseController.updateDescription)
course.post('/enroll', middleware, CourseController.enroll)

course.post('/add-video', middleware, CourseController.addVideo)
export default course