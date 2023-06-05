import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../Models/orderModel.js';
import fs from 'fs';
import json2csv from 'json2csv'; 
import path from 'path';
import {Blob} from 'node:buffer';
import verifyJWT from '../../JWT/verifyJWT.js';
import axios from 'axios';
import { shopifyCreateOrder } from '../API/Shopify/order.js';
import { shopifyDecreaseStock } from '../API/Shopify/stock.js';
import Store from '../../Models/storeModel.js';
import RestrictedProducts from './restrictedProducts.js';
import fetch from 'node-fetch';
 
const orderRouter = express.Router();
orderRouter.use(express.json());
// const d = new Date(new Date().setDate(new Date().getDate()));
const d = new Date("2022-02-11");
d.setHours(2,0,0,0)

const toPrice = (num) => Number(num.toFixed(2))

function ageRestriction(order){
  let count = 0
  let contain
  order.orderItems.map(product => console.log(product.category))
  order.orderItems.map(product => RestrictedProducts.includes(product.category) ? count += 1 : count = count)
  count > 0 ? contain = true : contain = false
  return contain
}

function Price(orderPrice, product, status){
  
  if(orderPrice){
    switch(status){
      case "scanItems": 
        return toPrice(orderPrice + product.Qty * product.price)
      case "deleteItems":
        return toPrice(orderPrice - product.Qty * product.price)
      default: 
        return null
    }
  }
  else{
    return toPrice(product.Qty * product.price)
  }

}

async function addDelete(order, orderProduct, addDeleteProduct, toAddDeleteProduct, champs){
  // const response = await fetch(`https://a9ce-195-154-25-125.ngrok-free.app/general/overallinfo/${order.storeId}`);
  // console.log(response)
  // Incrémenter Scan/Delete Items
  if(addDeleteProduct[champs].length === 0){
    order[champs].push(toAddDeleteProduct)
  }
  // Incrémenter la quantité d'un produit delete/scan de product.Qty
  else{  
    addDeleteProduct[champs][0].Qty += toAddDeleteProduct.Qty
    // await addDeleteProduct.save()
  }

  switch(champs){
    case "scanItems":
      // Incrémenter dans order.orderItems
      if(orderProduct.orderItems.length === 0){   
        order.orderItems.push(toAddDeleteProduct)  
        await order.save()    
      }
      else{
        orderProduct.orderItems[0].Qty += toAddDeleteProduct.Qty
        await orderProduct.save()
      }
      // Changement de prix order.itemsPrice
      order.itemsPrice = Price(order.itemsPrice, toAddDeleteProduct, "scanItems")
      ageRestriction(order) ? order.ageRestriction = "toCheck" : order.ageRestriction = ""
      return await order.save()

    case "deleteItems":
      if(orderProduct.orderItems[0].Qty - toAddDeleteProduct.Qty >= 1){
        // Décrémentation
        orderProduct.orderItems[0].Qty -= toAddDeleteProduct.Qty
        await orderProduct.save()
      }
      else{
        // suppression dans order
        order.orderItems.pull(orderProduct.orderItems[0])
        await order.save()
      }
      order.itemsPrice = Price(order.itemsPrice, toAddDeleteProduct, "deleteItems")
      ageRestriction(order) ? order.ageRestriction = "toCheck" : order.ageRestriction = ""
      return await order.save()
    default:
      break;
  }


}


orderRouter.post('/',expressAsyncHandler(async (req, res) => {
  console.log(req.body.orderItems)
  try{
    const order = new Order({
      storeId: req.body.storeId,
      clientId: req.body.clientId,
      // orderItems: req.body.orderItems,
      itemsPrice: 0,
      // promoPrice: req.body.promoprice
      promoPrice: 0,
    });
    const createdOrder = await order.save();
    res.status(201).send({message: "new order created", order: createdOrder})
  }catch(e){
    res.status(400).send(e)
    console.log(e)
  }

  })
);

orderRouter.get('/:orderId', expressAsyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.orderId);
    if(order){
        res.send(order)
    }
    else{
        res.status(404).send({message:'Order not Found'})
    }
  }))

orderRouter.put('/:orderId/add', expressAsyncHandler(async(req, res) => {

  const addProduct = req.body
  const order = await Order.findById(req.params.orderId)
  const orderProduct = await Order.findOne({_id: req.params.orderId}).select({ orderItems: {$elemMatch: {Code_Barre: addProduct.Code_Barre}}})
  const scanProduct = await Order.findOne({_id: req.params.orderId}).select({ scanItems: {$elemMatch: {Code_Barre: addProduct.Code_Barre}}})
  // if(order){
  const updatedOrder = await addDelete(order, orderProduct, scanProduct, addProduct, "scanItems")
  res.send(updatedOrder)
    
  // }
  // else{
  //   res.send("order not found")
  // }
}))


orderRouter.put('/:orderId/delete', expressAsyncHandler(async(req, res) => {

  const toDeleteProduct = req.body.product
  toDeleteProduct.Qty = req.body.qty
  // // Item à supprimer
  // req.body.deletedAt = Date.now()
  const order = await Order.findById(req.params.orderId)
  const orderProduct = await Order.findOne({_id: req.params.orderId}).select({ orderItems: {$elemMatch: {Code_Barre: toDeleteProduct.Code_Barre}}})
  // // Liste des items dans l'order MongoDb
  const deleteProduct = await Order.findOne({_id: req.params.orderId}).select({ deleteItems: {$elemMatch: {Code_Barre: toDeleteProduct.Code_Barre}}})
  // // Item à supprimer dans l'order MongoDb
  const updatedOrder = await addDelete(order, orderProduct, deleteProduct, toDeleteProduct, "deleteItems")
  res.send(updatedOrder)

}))

orderRouter.put('/:orderId/priceUpdate', expressAsyncHandler(async(req, res) => {

  const order = await Order.findById(req.params.orderId);

    if(order){

      order.itemsPrice = req.body.cartPrice;
      const updateOrder = await order.save();
      res.send({message: "Price updated", order: updateOrder})

    }else{

      res.status(404).send({message: "ERROR"})

    }

}))

orderRouter.put('/:orderId/pay', expressAsyncHandler(async(req,res) =>{

  const order = await Order.findById(req.params.orderId);
  const status = req.body.status
  const store = await Store.findById(order.storeId)

  if(store && order && status === "succeeded"){
    
    switch(store.api){

      case 'shopify': 
      // Création Order Shopify
      shopifyCreateOrder(req, store.storeName, store.accessToken)
      // Décrémentation stock Shopify
      shopifyDecreaseStock(req, store.storeName, store.accessToken)
      break;

      default:
      break;
    }
    order.isPaid = true; 
    order.paidAt = Date.now();
    order.email = req.body.email
    const updatedOrder = await order.save();
    const response = await fetch(`https://c537-2a01-cb00-7d5-6300-fd79-e5a7-7292-59f8.ngrok-free.app/general/overallinfo/${order.storeId}`);
    // console.log(response)
    res.send({message: 'Order Paid', order: updatedOrder, ok: status});

  }else{
    res.status(404).send({message: 'Order/Store not Found'})
  }



}));

orderRouter.put('/:orderId/commentaire', expressAsyncHandler(async(req,res) => {
  console.log("heyllo")
  const order = await Order.findById(req.params.orderId);
  if(order){
    console.log(order)
    order.commentaire = req.body.commentaire;
    const updateOrder = await order.save();
    res.send({message: "Commentaire ajouté", order: updateOrder});
  }else{
    res.status(404).send({message: "ERROR"})
  }
}))


export default orderRouter;