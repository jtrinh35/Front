import Stripe from 'stripe'
import dotenv from 'dotenv';

dotenv.config()

const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

export const createPaymentIntentsFP = (customerId, pm, amount) => {

    const paymentIntent = stripe.paymentIntents.create({
        amount: Math.round(amount * 1000), //*100
        currency: 'EUR',
        payment_method: pm,
        confirm: true,
        customer: customerId,
        off_session: true,
    });

    return paymentIntent
    
}
export const createPaymentIntentsRegister = (customer, amount) => {

    const paymentIntent = stripe.paymentIntents.create({
        amount: Math.round(amount * 1000), //*100
        currency: 'EUR',
        customer: customer.id,
        setup_future_usage: 'off_session',
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          },
    });

    return paymentIntent
    
}
export const createPaymentIntents = (amount) => {

    const paymentIntent = stripe.paymentIntents.create({
        amount: Math.round(amount * 100), //*100
        currency: 'EUR',
        payment_method_types: ['card'], 
        // payment_method: 'pm_1Nb32vDpRgB6XXl9O1zF4stN',
        // confirm: true,

        // receipt_email: receipt_email,
        expand: ["latest_charge"],
        receipt_email: "joe.trinh35@gmail.com"
    });

    return paymentIntent
    
}