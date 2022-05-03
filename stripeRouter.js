import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv';


dotenv.config()
const stripeRouter = express.Router()
stripeRouter.use(express.json());

const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

stripeRouter.post('/payment', async(req,res) =>{
    console.log(req)
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
        const clientSecret = paymentIntent.client_secret;
        res.json({
            message: 'Initialisation du payement réussi',
            clientSecret,
        })
    }catch(error){
        console.log("erreur", error);
        res.status(500).json({message: 'Internal servor error'})
        }
})


export default stripeRouter;