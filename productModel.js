import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    category: {type: String, required: false},
    image: {type: String, required: true},
    price: {type:Number, required: true},
    CountInStock: {type: Number, required: true},
    Code_Barre: {type: String, required: true},
    brand: {type: String, required: false},
    rating: {type: Number, required: false},
    numReviews: {type: Number, required: false},
    description: {type:String, required: true}
},
{
    timestamps: true,
});
const Product = mongoose.model('demoproducts', productSchema);

export default Product;