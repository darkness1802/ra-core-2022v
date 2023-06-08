import Excrise from '../models/excrise.model.js';
import Course from '../models/course.model.js';

export default class ExcriseController {
    static async getExcrises(req, res) {
        /* GET ALL EXCRISE OF COURSE */
        console.log(`GET ALL EXCRISE ${req.query.courseId}`)
        try {
            const excrises = await Excrise.find({ courseId: req.query.courseId })
            return res.status(200).json(excrises)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async createExcrise(req, res) {
        console.log(req.body)
        /* CREATE EXCRISE */
        let { status, genre, title, description, courseId, limit } = req.body
        let host = req.user.id
        try {
            const course = await Course.findById(courseId)
            if (course.host === host) {
                const excrise = await Excrise.create({ ...req.body })
                return res.status(200).json(excrise)
            } else return res.status(400).json({ message: "Can not create this excrise" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async updateExcrise(req, res) {
        /* UPDATE EXCRISE */
        let { genre, title, description, courseId, limit } = req.body
        let host = req.user.id
        try {
            const course = await Course.findById(courseId)
            if (course.host === host) {
                const excrise = await Excrise.findByIdAndUpdate(req.body.id, { genre, title, description, courseId, limit })
                return res.status(200).json(excrise)
            } else return res.status(400).json({ message: "Can not update this excrise" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async deleteExcrise(req, res) {
        /* DELETE EXCRISE */
        let host = req.user.id
        try {
            const course = await Course.findById(req.body.courseId)
            if (course.host === host) {
                const excrise = await Excrise.findByIdAndDelete(req.body.id)
                return res.status(200).json(excrise)
            } else return res.status(400).json({ message: "Can not delete this excrise" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async addFile(req, res) {
        /* ADD FILE TO EXCRISE */
        let host = req.user.id
        try {
            const course = await Course.findById(req.body.courseId)
            if (course.host === host) {
                const excrise = await Excrise.findByIdAndUpdate(req.body.id, { file: req.file.filename })
                return res.status(200).json(excrise)
            } else return res.status(400).json({ message: "Can not add file to this excrise" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
} 