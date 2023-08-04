import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';


dotenv.config()
const stripeRouter = express.Router()
stripeRouter.use(express.json());

const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

export const getData = expressAsyncHandler(async(id) => {

    // const payment = await stripe.paymentIntents.retrieve(id, 
    // {
    //   apiKey: process.env.STRIPE_CLIENT_SECRET
    // })
    // if(payment.charges.data[0]){
    //     return (payment.charges.data[0].receipt_url)
    //     // return(payment.charges.data[0].billing_details) 
    // }
    

})

stripeRouter.post('/payment', async(req,res) =>{
    let{name} = req.body;
    let{amount} = req.body;
    let{receipt_email} = req.body;
// pm_1Nb32vDpRgB6XXl9O1zF4stN
    try{
        const customerId = 'cus_ONnyVg2vQLgfkI'
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 1000),
            currency: 'EUR',
            // payment_method_types: ['card'], 
            payment_method: 'pm_1Nb32vDpRgB6XXl9O1zF4stN',
            confirm: true,
            receipt_email: receipt_email,
            customer: customerId,
            // off_session: 'false',
            // setup_future_usage: 'off_session',
            // automatic_payment_methods: {
            //     enabled: true,
            //     allow_redirects: 'never'
            //   },
        });
        const payment = paymentIntent.id
        const clientSecret = paymentIntent.client_secret;
        console.log(clientSecret)
        // const mail = await getData(paymentIntent.id)
        res.json({
            message: 'Initialisation du payement réussi',
            clientSecret, 
            // mail
        })
    }catch(error){
        console.log("erreur", error);
        res.status(500).json({message: 'Internal servor error'})
        }
})

stripeRouter.get('/customer', async(req, res) => {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: 'cus_ONnyVg2vQLgfkI',
        type: "card"
      });
      const card = await stripe.paymentMethods.retrieve(paymentMethods.data[0].id)
    //   console.log(paymentMethods.data[0].id)
    //   res.send(paymentMethods.data[0].id)
    console.log(card)
    res.send(card)
})



export default stripeRouter;