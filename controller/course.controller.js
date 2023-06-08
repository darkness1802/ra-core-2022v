import Course from "../models/course.model.js"
import Assignment from "../models/assignment.model.js"

export default class CourseController {

    static async createCourse (req, res) {
        const { title, token } = req.body
        console.log(`Create course ${title}`)
        if (!title || !token) return res.status(404).json({ message: "Missing title or token" })
        try {
            const newCourse = await Course.create({ title, host:req.user.id, token })
            return res.status(200).json(newCourse)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async courseInfo (req, res) {
        if (!req.query.id) return res.status(404).json({ message: "Course not found" })
        try {
            console.log(req.query.id)
            const course = await Course.findById(req.query.id)
            if (!course) throw new Error("Course not found")

            course.views += 1
            await course.save()

            return res.status(200).json(course)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async getCourses (req, res) {
        try {
            if (req.query.id) {
                const course = await Course.find({ host: req.query.id })

                course.views += 1
                await course.save()

                return res.status(200).json(course)
            } else {
                const courses = await Course.find({ host: req.user.id })
                return res.status(200).json(courses)
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async deleteCourse (req, res) {
        let { id } = req.body
        console.log(`Detele course ${id}`)
        try {
            const course = await Course.findByIdAndDelete(id)
            if (req.user.id === course.host) {
                course.remove()
                return res.status(200).json({ message: "Course deleted" })
            } else return res.status(400).json({ message: "Can not delete this course" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async getSingleCourse (req, res) {
        if (!req.query.id) return res.status(404).json({ message: "Course not found" })
        try {
            const course = await Course.findbyId(req.query.id)

            course.views += 1
            await course.save()

            return res.status(200).json(course)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async addAssignment (req, res) {
        let { courseId, content } = req.body
        let host = req.user.id
        try {
            const course = await Course.findById(courseId)

            if (course.host === host) {
                const newAssignment = await Assignment.create({ content, course: courseId, host })
                course.assignments.push(newAssignment)
                await course.save()
                return res.status(200).json(newAssignment)
            } else throw new Error("Can not add assignment")
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async findAssignments (req, res) {
        let { id } = req.query
        if (!id) throw new Error("Course ID is required")
        try {
            const results = await Assignment.find({ course:id })
            if (!results) throw new Error("No assignments found")
            return res.status(200).json(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async updateDescription (req, res) {
        let { title, content, id } = req.body
        let host = req.user.id
        console.log(`Update course`)
        if (!title || !content || !id) throw new Error("Missing title, content and id")
        try {
            const course = await Course.findById(id)
            if (course.host !== host) throw new Error("Can not update this course")
            course.description.title = title
            course.description.content = content
            await course.save()
            return res.status(200).json(course)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async enroll (req, res) {
        // Nguoi dung truyen len server user va course id
        let user = req.user
        let { courseId } = req.body
        console.log(`Enroll`)
        // Server tim kiem course id trong database, kiem tra xem da co student nay chua
        try {
            let course = await Course.findById(courseId)
            if (course.host === user.id) return res.status(300).json({ message: 2, course })
            let isExisted = course.students.find(student => student.id === user.id)
            if (!isExisted) { /* Nếu chưa tồn tại => thêm vào */
                course.students.push(user)
                await course.save()
                return res.status(200).json({ message: 1, course })
            } else { /* Nếu tồn tại => ... */
                return res.status(300).json({ message: 0, course })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async updateAssignment (req, res) {
        let { id, content, progress } = req.body
        let host = req.user.id
        if (!id || !content || !progress) throw new Error("Missing id, content and progress")
        try {
            const assignment = await Assignment.findById(id)
            if (host === assignment.host) {
                assignment.content = content
                assignment.progress = progress
                await assignment.save()
                return res.status(200).json({ message: "Assignment updated", assignment })
            } else throw new Error("Can not update this assignment")
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async addVideo (req, res) {
        let { courseId, videoId } = req.body
        console.log(`Add video by ${courseId}`)
        let host = req.user.id
        try {
            const course = await Course.findById(courseId)
            if (host === course.host) {
                course.videos.push(videoId)
                await course.save()
                return res.status(200).json({ message: "Video added", videos: course.videos })
            } else throw new Error("Can not add video")
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async latestCourses (req, res) {

        try {
            const courses = await Course.find().limit(6).sort({$natural:-1})
            return res.status(200).json(courses)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    static async popularCourses (req, res) {

        console.log(`194`)
        try {
            const courses = await Course.find().limit(6).sort({views:-1})

            console.log(courses)

            return res.status(200).json(courses)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}