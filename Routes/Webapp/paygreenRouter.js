import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';

dotenv.config()
const paygreenRouter = express.Router()
paygreenRouter.use(express.json());

const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

export const getData = expressAsyncHandler(async(id) => {

    const payment = await stripe.paymentIntents.retrieve(id, 
    {
      apiKey: process.env.STRIPE_CLIENT_SECRET
    })
    if(payment.charges.data[0]){
        return (payment.charges.data[0].receipt_url)
        // return(payment.charges.data[0].billing_details) 
    }
    

})



export default paygreenRouter;