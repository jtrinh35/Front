import Stripe from 'stripe'
import dotenv from 'dotenv';

dotenv.config()

const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

export const createCustomer = (name, email) => {

    const customer = stripe.customers.create({
        name: name,
        email: email
    })
    
    return customer

    
}