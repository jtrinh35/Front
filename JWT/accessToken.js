import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config()

const accessToken = (req, res, next) =>{
    const accessToken = jwt.sign(
        {"user": "test"},
        process.env.ACCESS_TOKEN, 
        {expiresIn: '1d'}
    )
    const refreshToken = jwt.sign(
        {"user": "test"},
        process.env.REFRESH_TOKEN, 
        {expiresIn: '1d'}
    )
    //sauvegarder le refresh token dans l'order
    res.cookie('jwt', refreshToken);
    // maxAge 1 day
    res.send(accessToken)
}

export default accessToken