import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import handleRefreshToken from "./refreshToken.js";

dotenv.config()

const verifyJWT = (req, res, next) =>{
    console.log(req.headers)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    if(!authHeader) return res.sendStatus(401)
    // console.log(authHeader) //Bearer
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err) => {
            if(err) {
                console.log(err)
                return res.sendStatus(403)
            }
            next()
        }
    )
}

export default verifyJWT