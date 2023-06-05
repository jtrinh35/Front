import axios from "axios";
import expressAsyncHandler from "express-async-handler";

export const shopifyCreateOrder = expressAsyncHandler(async(req, storeName, accessToken) => {
    const {order} = req.body
    console.log(order.orderItems)
     
    var result0 = order.orderItems.map(function(e){
      return{variant_id: parseInt(e.variant_idShopify), quantity: e.Qty, price: e.price}
    })
    console.log(result0)
    var data0 = JSON.stringify({
      "order" :{
        // "email": "joe.trinh35@gmail.com",
        "financial_status": "paid",
        "fulfillment_status": "fulfilled",
        "line_items": result0,    
      }
    })
    console.log("datahey" + data0)
    var config0 = {
      method: 'post',
      url: `https://${storeName}.myshopify.com/admin/api/2022-07/orders.json`,
      headers: { 
        'Content-Type': 'application/json', 
        'X-Shopify-Access-Token': accessToken, 
      },
      data : data0
    };
    try{
      axios(config0)
    }catch(e){
      console.log(e)
    }
})
