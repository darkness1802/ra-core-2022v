import express from 'express'
import multer from 'multer'
import fs from 'fs'
import Course from '../models/course.model.js'
import File from '../models/file.model.js'

const router = express.Router()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

router.post('/', upload.single('file'), async function (req, res) {

    console.log(`UPLOAD COMPLETE:`, req.file);

    let target = fs.readFileSync(`./public/${req.file.filename}`);
    console.log(25, target)
    var encoded = target.toString('base64');

    var finalData = {
        path: req.file.filename,
        source: new Buffer(encoded, 'base64')
    };
    console.log(finalData)

    try {
        await File.create({ path: finalData.path, source: finalData.source })
        return res.status(200).json({ msg: "Complete" })
    } catch (err) {
        console.log(err, "Can not upload file to database")
        return res.status(500).json({ code: err.code, msg: "Can not upload file to database" })
    }

})

router.post(`/upload`, async (req, res)=> {
    console.log(`UPLOAD COMPLETE:`, req.body);

    try {
        let course = await Course.findById(req.body.courseId)
        course.excriseFile = req.body.data.downloadURL
        await course.save()
        return res.status(200).json({ msg: "Complete", download: `/file/download?id=${req.body.courseId}` })
    } catch (err) {
        console.log(err, "Can not upload file to database")
        return res.status(500).json({ code: err, msg: "Can not upload file to database" })
    }
})

router.get(`/download`, async (req, res) => { // --- /download?id=COURSE_ID ---
    try {
        let course = await Course.findById(req.query.id)
        console.log(course)
        if (course.excriseFile) {
            return res.redirect(course.excriseFile)
        } else throw new Error("Course not found")
    } catch (err) {
        console.log(err)
    }
})


export default router