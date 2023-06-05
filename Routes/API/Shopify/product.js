import axios from "axios";
import expressAsyncHandler from "express-async-handler";

export const shopifyGetProductByBc = expressAsyncHandler(async(Code_Barre, storeName, accessToken) => {
    // 7560201379624
    var data = JSON.stringify({
        query: `{
        products(first: 1, query: "barcode:${Code_Barre}") {
          edges {
            node {
              variants(first: 10) {
                edges {
                  node {
                    inventoryItem{
                        id
                    }
                    barcode
                    id
                    title
                    price
                    image{
                        url
                    }
                    product{
                        title
                        images(first:1){
                            edges{
                                node{
                                    url
                                }
                            }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
        variables: {}
      });

      var config = {
        method: 'post',
        url: `https://${storeName}.myshopify.com/admin/api/2023-01/graphql.json`,
        headers: { 
          'X-Shopify-Access-Token': accessToken, 
          'Accept': '"/"', 
          'Content-Type': 'application/json'
        },
        data : data
      };
    try{
    let product
    let image
    var result = await axios(config)
    result = result.data.data.products.edges[0].node.variants.edges
    console.log(result.length)
    for(let i = 0; i < result.length; i++){
        if(result[i].node.barcode === Code_Barre){
            const id = result[i].node.id.split('/')[4]
            const inventory_id = result[i].node.inventoryItem.id.split('/')[4]
            const Code_Barre = result[i].node.barcode
            const name = result[i].node.product.title
            const price = result[i].node.price
            if( result[i].node.image === null || result[i].node.image.length === 0){
                image = result[i].node.product.images.edges[0].node.url
            }
            else{
                image = result[i].node.image
            }
            product = [{
                variant_idShopify: id,
                inventory_idShopify: inventory_id,
                name: name,
                Code_Barre : Code_Barre,
                price: parseFloat(price),
                image: image,
            }]
        }
        
    }
    return(product)
    }catch(e){
        console.log(e)
        return({message: 'Product not Found'})
    }
    
    // res.send(JSON.parse(JSON.stringify(product)))

})