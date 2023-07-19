import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({  
    name: {type: String, required: false},
    address: {type: String, required: false},
    connect : {type: String, required: false},
    fixe: {type: Number, required: false},
    variable: {type: Number, required: false},
    cashback: {type: Boolean, required: false},
    logo: {type: String, required: false},
    api: {type: String, required: false},
    ageRestriction: {type: String, required: false},
    // Shopify
    storeName: {type: String, required: false},
    accessToken: {type: String, required: false},
    avis_google: {type: String, required: false},
    item_limit: {type: Number, required:false}
    // 
    },
);
     
const Store = mongoose.model('stores', storeSchema);

export default Store