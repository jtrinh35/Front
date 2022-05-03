// import expressAsyncHandler from "express-async-handler";
// import Order from "./orderModels.js";
// import express from 'express'

// const orderRouter = express.Router();
// orderRouter.use(express.json());

// orderRouter.post('/', expressAsyncHandler(async(req, res)=>{
//     if(req.body.orderItems.length === 0){
//         res.status(400).send({message: "cart is empty"})
//     }
//     else{
//         const order = new Order({
//             orderItems: req.body.orderItems,
//             itemsPrice: req.body.itemsPrice,
//         });
//         const createdOrder = await order.save();
//         res
//             .status(201)
//             .send({message: "New Order Created", order: createdOrder});
//     }
// }))

// export default orderRouter;
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from './orderModels.js';
import fs from 'fs';
import json2csv from 'json2csv'; 
import path from 'path';
import {Blob} from 'node:buffer';

const orderRouter = express.Router();
orderRouter.use(express.json());
// const d = new Date(new Date().setDate(new Date().getDate()));
const d = new Date("2022-02-11");
d.setHours(2,0,0,0)

orderRouter.post('/',expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        itemsPrice: req.body.itemsPrice,
        promoPrice: req.body.promoprice
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
  })
);
orderRouter.get('/info',expressAsyncHandler(async(req, res) => {
  
  const aggregatorOpts = [{"$match": {"paidAt":{"$gte": d}}},
{
    $unwind: "$orderItems"
},
{
    $group: {
        _id:"$orderItems.name",
        count: { $sum: 1 },
        somme: { $sum: "$orderItems.price" },
    }}
]
const aggregatorOpts1 = [{"$match": {"paidAt":{"$gte": d}}},
{
    $unwind: "$orderItems"
},
{
    $group: {
        _id: "$orderItems.Code_Barre",
        // _id:"$orderItems.name",
        count: { $sum: 1 },
        somme: { $sum: "$orderItems.price" },
    }}
]
const aggregatorOpts2 = [{"$match": {"paidAt":{"$gte": d}}},
{
    $unwind: "$orderItems"
},
{
    $group: {
        // _id: { day: d},
        _id: d,
        somme: { $sum: "$orderItems.price" }
    }}
]
const cursor2 = await Order.aggregate(aggregatorOpts2).exec()
const cursor = await Order.aggregate(aggregatorOpts).exec()
const cursor1 = await Order.aggregate(aggregatorOpts1).exec()
  res.send({date: d,infos: cursor,code : cursor1, CA: cursor2});
}))
orderRouter.get('/:orderId', expressAsyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.orderId);
    if(order){
        res.send(order)
    }
    else{
        res.status(404).send({message:'Order not Found'})
    }
    }))

orderRouter.put('/:orderId/pay', expressAsyncHandler(async(req,res) =>{
  const order = await Order.findById(req.params.orderId);
  const status = req.body.status
  if(order && status === "succeeded"){
    order.isPaid = true;
    order.paidAt = Date.now();
    order.email = req.body.email
    const updatedOrder = await order.save();
    res.send({message: 'Order Paid', order: updatedOrder, ok: status});
  }else{
    res.status(404).send({message: 'Order not Found'})
  }
}));

orderRouter.put('/:orderId/commentaire', expressAsyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.orderId);
  if(order){
    order.commentaire = req.body.commentaire;
    const updateOrder = await order.save();
    res.send({message: "Commentaire ajouté", order: updateOrder});
  }else{
    res.status(404).send({message: "ERROR"})
  }
}))

orderRouter.get('/exportdataa', expressAsyncHandler(async(req,res) => {
  // Order.find(function(err, orders){
  //   console.log(orders)
  // })
  res.send('hello')
}))

export default orderRouter;