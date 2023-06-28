import expressAsyncHandler from 'express-async-handler';
import Store from '../../Models/storeModel.js';
import express from 'express';
import data from '../../data.js';

const storeRouter = express.Router();

storeRouter.get('/:id', expressAsyncHandler(async(req,res) => {
    try{
        const store = await Store.findById(req.params.id);
        if(store){
            res.status(200).send({
                name: store.name, id: store.id, 
                    cashback: store.cashback,logo: store.logo, ageRestriction: store.ageRestriction,
                    avis_google: store.avis_google
            })
        }
        else{
            res.status(404).send({message: "Store not found"})
        }
    }catch(e){
        res.status(505).send({message: e})
    }
}))


export default storeRouter;