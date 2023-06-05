import expressAsyncHandler from 'express-async-handler';
import Product from '../../Models/productModel.js'
import express from 'express';
import data from '../../data.js';
import { shopifyGetProductByBc } from '../API/Shopify/product.js';
import Store from '../../Models/storeModel.js';
import Stripe from 'stripe'
import { getData } from './stripeRouter.js';
const stripe = new Stripe (process.env.STRIPE_CLIENT_SECRET)

const productRouter = express.Router();

Product.watch().
//   on('change', data => console.log(data));
on('change', async function(data){
    const product = await Product.findById(data.documentKey)
    console.log(product)
    // console.log(data.documentKey)
})

productRouter.post('/', expressAsyncHandler(async(req, res)=>{
  
  const id = req.body.id
  const pay = await getData(id)

  res.send(pay)

}));

productRouter.get('/seed', expressAsyncHandler(async(req,res) =>{
    await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts});
}));

productRouter.get('/:storeId/:Code_Barre', expressAsyncHandler(async(req,res)=>{
    
    let store
    let product
    try{
        store = await Store.findById(req.params.storeId);
        if(!store){
            res.status(404).send({message: "Store not found"})
        }

    }catch(e){
        res.status(505).send({message: e})
    }
    switch(store.api){
        
        case 'shopify': 
        product = await shopifyGetProductByBc(req.params.Code_Barre, store.storeName, store.accessToken)
        break;
        
        case 'mongoDb': 
        product = await Product.find({ storeId: req.params.storeId, Code_Barre: req.params.Code_Barre})
        break;

        default:
        res.status(404).send({message: 'Product not Found'})
    }
    if(product && product.length > 0){
        
        res.send(product)
    }
    else{
        res.status(404).send({message: 'Product not Found'})
    }
}));

export default productRouter;