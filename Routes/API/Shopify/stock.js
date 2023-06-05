import axios from "axios";
import expressAsyncHandler from "express-async-handler";

export const shopifyDecreaseStock = expressAsyncHandler(async(req, storeName, accessToken) => {
    const {order} = req.body
    var result1 = (order.orderItems.map(function(e){
        return{
            location_id:67094904995,inventory_item_id: e.inventory_idShopify, available_adjustment: -e.Qty
        }
    }))

    for(let i = 0; i < result1.length; i++){
        var config1 = {
            method: 'post',
            url: `https://${storeName}.myshopify.com/admin/api/2022-04/inventory_levels/adjust.json`,
            headers: { 
                'Content-Type': 'application/json', 
                'X-Shopify-Access-Token': accessToken, 
            },
            data : result1[i]
            };
            axios(config1)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }


})