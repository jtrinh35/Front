import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';


dotenv.config()
const stripeRouter = express.Router()
stripeRouter.use(express.json());

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

stripeRouter.post('/payment', async(req,res) =>{
    let{name} = req.body;
    let{amount} = req.body;
    let{receipt_email} = req.body;

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'EUR',
            payment_method_types: ['card'], 
            receipt_email: receipt_email,
        });
        const payment = paymentIntent.id
        console.log(paymentIntent.charges.data)
        const clientSecret = paymentIntent.client_secret;
        const mail = await getData(paymentIntent.id)
        res.json({
            message: 'Initialisation du payement réussi',
            clientSecret, 
            mail
        })
    }catch(error){
        console.log("erreur", error);
        res.status(500).json({message: 'Internal servor error'})
        }
})



export default stripeRouter;