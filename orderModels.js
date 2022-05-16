import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderItems: [{
        name: {type: String, required: true},
        image: {type: String, required: true},
        price: {type: Number, required: true},
        Code_Barre: {type: String, required: true},
        product: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false},
    }],
    email: {type: String, required: false},
    itemsPrice: {type:Number, required: false},
    promoPrice: {type: Number, required: false},
    commentaire: {type: String, required: false},
    isPaid: {type: Boolean, default : false},
    paidAt: {type: Date}
    },
    {
    timestamps: true,
    }
    );
     
    const Order = mongoose.model('test_orders', orderSchema);
    export default Order;