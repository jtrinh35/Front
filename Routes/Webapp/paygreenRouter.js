import express from 'express'
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import { getToken } from '../API/Paygreen/getToken.js';
import {verifyToken} from '../API/Paygreen/verifyToken.js';
import { createBuyer } from '../API/Paygreen/createBuyer.js';
import { getInstrument } from '../API/Paygreen/getInstrument.js';

dotenv.config()
const paygreenRouter = express.Router()
paygreenRouter.use(express.json());

// let token = await getToken()
// paygreenRouter.use(verifyToken)
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTMyMzcxNDIsImV4cCI6MTY5MzIzNzc0Miwicm9sZXMiOlsiU0NPUEVfU0VDUkVUX0tFWSIsIlJPTEVfU0VDUkVUX0tFWSIsIlNDT1BFX0NMSUVOVF9NQVJLRVRQTEFDRSJdLCJ1c2VybmFtZSI6IjcyMDIxOTFhLTQzMTUtNDRiOS04NDk0LWVkMGMyOTMyYWRhNyIsInVzcl8iOiI3MjAyMTkxYS00MzE1LTQ0YjktODQ5NC1lZDBjMjkzMmFkYTciLCJ1c3JfdHlwZSI6InNob3AifQ.mV_rr3Rnr3Sp4XhNyNzmP9mxhTX-l3e1T4HCNVHZOsMf8awoNzIod36RW8b6FLWXV76LGhvu9i9GVSgTGbnzdpGdh3fnj2Oh-5G9X3M09mbSNliaMObdYd6KOxWhGx6990WhvQaP-d8ZOriRVB3vIHyUI8dzuKDzvnC6JK__uzWC0-4gRdd21VrD9jJjCwkHDHdI58WUoWDipOp06Wrq7ENeHxqwe6g3KcBysgawy9n7lq1oaYKvdybDs3_ilgu-hVbFj0VdjhUumHF5PmZ0NNJ5TmwisDVZHvmIzDl4htq-FklnW5YJMCKrScTEIeeupAeGMY-40tRAUJKlnpKQNgvQI9qNkQgnOryTCojP6gEkx55Bamw6mVu8QFm5ixNivP4M_aJ-aNyCEH1mKa-l2Q1HV_dXOj927LquM95jLikUfv6-f7oUycbepcxdDu5eCa_K1BrC8_2ydPQYfgsmR7UPy2Zfwvjl3HsxeUnb2Qb-9dRQKZQmZ3DImBJd1_qWSbUdHclCm31_DUjpQ2tyPQaVUf_YgIFKde2k4tW5iJZq9erRCZQBLW1XvmBnBP4Jnbm0752p4E-RgJfRpuxrOxl-VJBCAf75MX8Ne2VPmpHOLnrXmrTsYjWSM2q7It1riE61SWSx35kz02Binq9NtLrDMc2gRE26iOll7z2BfiA"

paygreenRouter.post('/createBuyer', expressAsyncHandler(async(req,res) => {

  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  try{
    const user = await createBuyer(token, firstName, lastName, email)
    res.send(user)
  }catch(e){
    res.sendStatus(e.response.status)
  }

}))

paygreenRouter.put('/instrument', expressAsyncHandler(async(req, res) => {

  const instrumentId = req.body.instrumentId
  try{
    const instrument = await getInstrument(token ,instrumentId)
    res.send(instrument)
  }catch(e){
    console.log(e.response)
    res.sendStatus(e.response.status)
  }

}))



export default paygreenRouter;