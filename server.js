import productRouter from './productRouter.js';
import stripeRouter from './stripeRouter.js'
import mailRouter from './mailRouter.js'
import express from 'express';
import mongoose from 'mongoose';
import data from './data.js';
import orderRouter from './orderRouter.js'
import dotenv from 'dotenv';
import cors from 'cors'


dotenv.config()

const app = express();
app.use(cors({origin:["http://localhost:3000"]}))


/* Connection à MongoDB */

mongoose.connect(
    `mongodb+srv://Joe:Stardown@cluster0.4ypza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology : true},
    (err) => {
        if (!err) console.log("Connexion à MongoDb réussie !");
        else console.log("connection error :" + err);
    }
)

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/stripe', stripeRouter);
app.use('/mail', mailRouter);

app.get('/products/:id', (req,res)=>{
    const product = data.products.find((x) => x._id === req.params.id);
    if(product){
        res.send(product)
    }else{
        res.status(404).send({message: 'Product not found'})
    }
})
app.get('/paypal', (req,res)=>{
    // res.send(process.env.PAYPAL_CLIENT_ID2 || 'sb')
    res.send("AXA__m14gu4pR_vxt01KheLjsITBWusgYLvbZ6NR5fKhWPIPBaZKWYLA4M5ZpPnsEtoTLhoTATgyZ8zY")
})
let port = process.env.PORT
app.get('/', (req,res) => {
    res.send(port)
})
app.listen(port || 5000, () => {console.log(`serveur ${port} connecté`)})


// heroku git:remote -a myapp
// git remote rm origin
// git remote add origin [//your github url]

// git pull origin master 

// or optionally, 'git pull origin master --allow-unrelated-histories' if you have initialized repo in github and also committed locally

//git push -f origin master