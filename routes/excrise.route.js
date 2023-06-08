import { Router } from 'express'
import middleware from '../middleware.js'
import ExcriseController from '../controller/excrise.controller.js'
const excrise = Router()

excrise.get('/', ExcriseController.getExcrises)
excrise.post('/create', middleware, ExcriseController.createExcrise)
excrise.post('/update', middleware, ExcriseController.updateExcrise)
excrise.post('/delete', middleware, ExcriseController.deleteExcrise)
excrise.post('/add-file', middleware, ExcriseController.addFile)
export default excrise