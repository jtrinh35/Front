import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config()


const handleRefreshToken = (req, res) =>{
    
    const cookies = req.cookies
    if(!cookies?.jwt) res.sendStatus(401)
    const refreshToken = cookies.jwt

    // order.refreshToken = refreshToken
    jwt.sign(
        refreshToken,
        process.env.REFRESH_TOKEN, 
        (err) => {
            if(err) return res.sendStatus(404)
            const accessToken = jwt.sign(
                {"user": "test" },
                process.env.ACCESS_TOKEN,
                {expiresIn: '30s'}
            )
            res.send(accessToken)
        }
        
    )
    // res.send("hey")
}

export default handleRefreshToken