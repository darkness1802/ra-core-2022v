import { verifyAccess } from './service/access.service.js'

export default async function middleware(req, res, next) {
    console.log(`Middleware`)
    const access = req.headers['access']
    console.log(access)
    try {
        const decoded = await verifyAccess(access)
        if (decoded) {
            req.user = decoded
            next()
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error })
    }
}
