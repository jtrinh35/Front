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
        res.cookie('__session', token.refresh_token, {
            httpOnly: true,
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
        res.cookie('Edenred', data.refresh_token, {
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



edenredRouter.post('/delete', expressAsyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.Edenred) {
      return res.sendStatus(401);
    }
    console.log(req.body)
    try {
      res.clearCookie('Edenred', { httpOnly: true, secure: true });
  
      const token = req.cookies;
      const tokenTypeHint = 'access_token'
      const client_id = '427b16d007b048c5b7416ec28cf69e37'
      const client_secret = 'iU4E-YsnDogLkKWM3GJIV6x38rVxVoAoRCNyfPru'
  
      const revocationEndpoint = 'https://sso.sbx.edenred.io/connect/revocation';
      const requestBody = `token=${token}&token_type_hint=${tokenTypeHint}&client_id=${client_id}&client_secret=${client_secret}`;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${req.body.access_token}`
      };
  
      const response = await axios.post(revocationEndpoint, requestBody, { headers });
      return res.send("revocation success");
  
    } catch (error) {
        res.status(error.response.status).send({error: error.response.data})

    }
  }));



export default edenredRouter;