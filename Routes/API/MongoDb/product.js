import axios from "axios";
import expressAsyncHandler from "express-async-handler";
import Product from "../../../Models/productModel";

export const MongoGetProductByBc = async(storeId, Code_Barre) => {
  const product = await Product.find({ storeId: storeId, Code_Barre: Code_Barre})
  if(product){
      res.send(product)
  }
  else{
      res.status(404).send({message: 'Product not Found'})
  }
}

