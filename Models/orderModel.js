import mongoose from 'mongoose';
import Product from './productModel.js';
var ProductModel = Product.schema
const date = new Date(Date.now() + (2 * 60 * 60 * 1000))
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
    // createdAt: { type: Date, default: date },
    // updatedAt: { type: Date, default: new Date(Date.now() + (2 * 60 * 60 * 1000)) },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
  );
  orderSchema.pre('save', function(next) {
    if (this.isModified('paidAt')) {
      this.paidAt = new Date(Date.now());
    }
    // if(this.isModified('itemsPrice') || this.isModified('scanItems') || this.isModified('orderItems')){
    //   this.updatedAt = new Date(Date.now() + (2 * 60 * 60 * 1000));
    // }
    // if(this.isModified()){
    //   this.updatedAt = new Date(Date.now() + (2 * 60 * 60 * 1000));
    // }
    next();
  });
const Order = mongoose.model('ordertests', orderSchema);
export default Order;