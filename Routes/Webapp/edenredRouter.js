import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import { getToken } from '../API/Edenred/getToken.js';
import { getUserInfo } from '../API/Edenred/getUserInfo.js';
import { getBalance } from '../API/Edenred/getBalance.js';
import { useRefreshToken } from '../API/Edenred/useRefreshToken.js';
import { revoke_token } from '../API/Edenred/revokeToken.js';
import { transactionCapture } from '../API/Edenred/transactionCapture.js';
import { transactionConfirm } from '../API/Edenred/transactionConfirm.js';
import { transactionCancel } from '../API/Edenred/transactionCancel.js';


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
        res.cookie('__session', token.refresh_token, {
            httpOnly: true, secure: true, sameSite: 'none'
        })
        // res.setHeader('Cache-Control', 'private');

        // res.cookie('__session_okok', "hello world")
        res.send(response)
    }
    catch(error){
        console.log(error.response.data)
        res.status(error.response.status).send({error: error.response.data})
    }

    })
);

edenredRouter.put('/balance',expressAsyncHandler(async(req, res) => {

    // const username = "123"
    const username = req.body.username
    const access_token = req.body.access_token

    try{
        const balance = await getBalance(username, access_token)
        const amount = balance.data[0].available_amount
        const currency = balance.data[0].currency
        const response = {balance: {amount: amount, currency: currency}}  
        // res.cookie('__session', "testtest", {
        //     httpOnly: true, secure: true, sameSite: 'none'
        // })
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
    console.log(cookies)
    if(!cookies?.__session) res.sendStatus(401)
    const refreshToken = cookies.__session
    try{
        const data = await useRefreshToken(refreshToken)
        res.cookie('__session', data.refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        res.send(data.access_token)
    }
    catch(error){
        res.status(error.response.status).send({error: error.response.data})
    }
}))

edenredRouter.post('/capture', expressAsyncHandler(async(req, res) => {
    console.log(req.body)
    const order = req.body.order
    const amount = req.body.amount
    const edenred = JSON.parse(req.body.edenred)
    try{
        const data = await transactionCapture(order, amount, edenred)
        console.log(data)
        res.send(data)
    }
    catch(error){
        res.status(error.response.status).send({error: error.response.data})
    }

}))

edenredRouter.post('/payment', expressAsyncHandler(async(req, res) => {
    console.log(req.body)
    const authorized_amount = req.body.authorized_amount
    const authorization_id = req.body.authorization_id
    try{
        const data = await transactionConfirm( authorized_amount, authorization_id)
        res.send(data)
    }
    catch(error){
        res.status(error.response.status).send({error: error.response.data})
    }

}))

edenredRouter.post('/cancel', expressAsyncHandler(async(req, res) => {
    const authorized_amount = req.body.authorized_amount
    const authorization_id = req.body.authorization_id
    try{
        const data = await transactionCancel( authorized_amount, authorization_id)
        res.send(data)
    }
    catch(error){
        res.status(error.response.status).send({error: error.response.data})
    }

}))


edenredRouter.post('/delete', expressAsyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.Edenred) {
      return res.sendStatus(401);
    }
    const refreshToken = cookies.Edenred
    console.log(refreshToken)
    try {
      res.clearCookie('Edenred', { httpOnly: true, secure: true }); 
      const revoke = await revoke_token(refreshToken)
      console.log(revoke)
      res.send(revoke)
    
    } catch (error) {
        res.status(error.response.status).send({error: error.response.data})
    }
  }));




export default edenredRouter;