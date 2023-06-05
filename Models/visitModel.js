import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    storeId: {type: String, required: true}
},
{
    timestamps: {
        createdAt: true, 
        updatedAt: false
      }
});

const Visit = mongoose.model('visits', visitSchema);

export default Visit