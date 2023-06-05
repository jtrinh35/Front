import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../Models/orderModel.js';
import Visit from '../../Models/visitModel.js';
import accessToken from '../../JWT/accessToken.js';

const trackRouter = express.Router()
trackRouter.use(express.json())

trackRouter.post('/visit', expressAsyncHandler(async(req, res) => {

    const count = new Visit({
        storeId: req.body.storeId
    })
    
    await count.save()
    res.status(201)
}))

trackRouter.put('/cartscreen', expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.body.id);
    if(order){
        order.cartScreen = true
        await order.save();
        res.send({message: 'cartScreen visit'})
        
    }else{
        res.status(404).send({message: 'Order not Found'})

    }
}))

trackRouter.put('/orderscreen', expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.body.id);
    if(order){
        order.orderScreen = true
        await order.save();
        res.send({message: 'orderScreen visit'})
        
    }else{
        res.status(404).send({message: 'Order not Found'})

    }
}))



export default trackRouter