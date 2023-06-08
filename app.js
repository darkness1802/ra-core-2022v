import "./root.js"
import os from "os"
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import DBConnect from './database.js'

import auth from './routes/auth.route.js'
import course from './routes/course.route.js'
import search from './routes/search.route.js'
import file from './routes/file.route.js'
import excrise from './routes/excrise.route.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

DBConnect()

app.get("/", (req, res) => {
    console.log("Hello World")
    return res.json({ cpu: os.cpus() })
})

app.get("/ping", (req, res) => {
    console.log(req.headers)
    return res.json(`PING`)
})

app.use("/auth", auth)
app.use("/course", course)
app.use("/search", search)
app.use("/file", file)
app.use("/excrise", excrise)

export default app