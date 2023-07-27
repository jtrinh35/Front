import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import { getToken } from '../API/Edenred/getToken.js';
import { getUserInfo } from '../API/Edenred/getUserInfo.js';
import { getBalance } from '../API/Edenred/getBalance.js';
import { useRefreshToken } from '../API/Edenred/useRefreshToken.js';


const edenredRouter = express.Router();
edenredRouter.use(express.json());

edenredRouter.put('/info',expressAsyncHandler(async (req, res) => {
    const code = req.body.code
    const session = req.body.session
    try{
        const token = await getToken(code)
        const user = await getUserInfo(token.access_token)
        const balance = await getBalance(user.username, token.access_token)
        const response = {
            access_token: token.access_token,
            username: user.username,
            balance: {amount: balance.data[0].available_amount, currency: balance.data[0].currency},
            session: session
        }
        res.cookie('Edenred', token.refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        res.send(response)
    }
    catch(error){
        console.log(error)
        res.status(error.response.status).send({error: error.response.data})
    }

    })
);

edenredRouter.put('/balance',expressAsyncHandler(async(req, res) => {

    console.log(req.body)
    // const username = "123"
    const username = req.body.username
    const access_token = req.body.access_token

    try{
        const balance = await getBalance(username, access_token)
        const response = {balance: {amount: balance.data[0].available_amount, currency: balance.data[0].currency}}  
        res.send(response)  
    }
    catch(error){
        console.log(error.response.status)
        if( error.status === 401)
        {
            res.status(error.response.status).send({error: error.response.data.meta.messages[0].text})
        }else{
            res.status(error.response.status).send({error: error.response.data})
        }
    }
    

}))

edenredRouter.post('/refresh', expressAsyncHandler(async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.Edenred) res.sendStatus(401)
    const refreshToken = cookies.Edenred
    try{
        const data = await useRefreshToken(refreshToken)
        res.cookie('Edenred', data.refresh_token)
        res.send(data.access_token)
    }
    catch(error){
        res.status(error.response.status).send({error: error.response.data})
    }
}))


export default edenredRouter;