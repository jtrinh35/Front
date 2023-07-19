import mongoose from 'mongoose';
import Product from './productModel.js';

var ProductModel = Product.schema

const orderSchema = new mongoose.Schema({
    storeId: {type: mongoose.Types.ObjectId, required: true},
    orderItems: [ProductModel],
    scanItems:[ProductModel],
    deleteItems: [ProductModel],
    email: {type: String, required: false},
    ageRestriction: {type: String, required: false},
    itemsPrice: {type:Number, required: true},
    promoPrice: {type: Number, required: false},
    finalPrice: {type: Number, required:false},
    commentaire: {type: String, required: false},
    isPaid: {type: Boolean, default : false},
    cartScreen: {type: Boolean, default: false},
    orderScreen: {type: Boolean, default: false},
    paidAt: {type: Date},
    verification: {type:Boolean, default : false},
    },
    {
    timestamps: true,
    }
    );
    orderSchema.pre('save', function(next) {
        if (this.isModified('paidAt')) {
          this.paidAt = new Date(this.paidAt.getTime() + (2 * 60 * 60 * 1000));
          console.log("hello world")
        }
        next();
      });
    const Order = mongoose.model('ordertests', orderSchema);
    export default Order;