import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {type: String, required: false, unique: true},
    category: {type: String, required: false},
    image: {type: String, required: false},
    price: {type:Number, required: false},
    Code_Barre: {type: String, required: false},
    Qty: {type: Number, required: false},
    scannedAt: {type: Date, required: false},
    deletedAt: {type: Date, required: false},
    // Shopify
    inventory_idShopify: {type: String, required: false},
    variant_idShopify: {type: String, required: false},
    // 
    
},
{
    // timestamps: true,
});
const Product = mongoose.model('products', productSchema);

export default Product;