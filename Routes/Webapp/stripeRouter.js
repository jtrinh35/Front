import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import { createCustomer } from '../API/Stripe/createCustomer.js';
import { createPaymentIntents, createPaymentIntentsRegister, createPaymentIntentsFP } from '../API/Stripe/paymentIntents.js';
import { statement } from '../API/Stripe/statement.js';

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
    console.log(req.body)
    let{name} = req.body;
    let{amount} = req.body;
    let{email} = req.body;
    let {saveCard} = req.body
    let {customerId} = req.body
    let {pm} = req.body

    let  paymentIntent;

    const state = statement(saveCard, customerId)
    console.log(state)
// pm_1Nb32vDpRgB6XXl9O1zF4stN
    try{
        switch(state){
            case 'register':
                const customer = await createCustomer(name, email)
                paymentIntent = await createPaymentIntentsRegister(customer, amount)
                res.json({
                    customer: customer.id,
                    message: 'Initialisation du payement réussi',
                    clientSecret: paymentIntent.client_secret, 
                })
                break
            case 'FP':
                paymentIntent = await createPaymentIntentsFP(customerId, pm, amount)
                console.log(paymentIntent)
                res.json({
                    message: 'Paiement réussi',
                    paymentIntentId: paymentIntent.id ,
                    clientSecret: paymentIntent.client_secret, 
                })
                break
            case 'classic':
                paymentIntent = await createPaymentIntents(amount)
                res.json({
                    message: 'Initialisation du payement réussi',
                    clientSecret: paymentIntent.client_secret, 
                })
                break
            default:
                console.log("Statement non reconnu")
        }
        // const customerId = 'cus_ONnyVg2vQLgfkI'
       
    }catch(error){
        console.log("erreur", error);
        res.status(500).json({message: 'Internal servor error'})
        }
})


stripeRouter.post('/receipt', expressAsyncHandler(async(req,res) => {
    console.log(req.body)
    const id = req.body.id
    // const id ="pi_3NcuBdDpRgB6XXl90h2N1WrM_secret_g34eNMlX12d0xive7yWymyBHM"
    const paymentIntent = await stripe.paymentIntents.retrieve(id)
    const paymentCharges = await stripe.charges.retrieve(paymentIntent.latest_charge)
    res.send(paymentCharges.receipt_url)

    
}))


stripeRouter.post('/customer', async(req, res) => {
    const customerId = req.body.customerId
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card"
      });
      const pm = await stripe.paymentMethods.retrieve(paymentMethods.data[0].id)
      console.log(pm.id)
      console.log(pm.card.brand)
      console.log(pm.card.last4)
    //   res.send(paymentMethods.data[0].id)
    res.send({id: pm.id, brand: pm.card.brand, last4: pm.card.last4})
})


export default stripeRouter;