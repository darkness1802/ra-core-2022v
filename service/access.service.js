import jwt from 'jsonwebtoken'

export const verifyAccess = async (access) => {
    if(!access) return null
    return new Promise((resolve,reject) => jwt
        .verify(access, 
            global.jwtAccessToken, 
                (err,decoded) => err ? reject({}) : resolve(decoded))
 )
 }

export const generateAccess = async (payload) => {
    return jwt.sign(payload, global.jwtAccessToken)
}