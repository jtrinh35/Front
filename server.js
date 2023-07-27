import productRouter from './Routes/Webapp/productRouter.js';
import stripeRouter from './Routes/Webapp/stripeRouter.js'
import mailRouter from './Routes/Webapp/mailRouter.js'
import express from 'express';
import mongoose from 'mongoose';
import data from './data.js';
import orderRouter from './Routes/Webapp/orderRouter.js'
import trackRouter from './Routes/Webapp/trackRouter.js';
import dotenv from 'dotenv';
import cors from 'cors'
import storeRouter from './Routes/Webapp/storeRouter.js';
import verifyJWT from './JWT/verifyJWT.js';
import accessToken from './JWT/accessToken.js'; 
import handleRefreshToken from './JWT/refreshToken.js';
import cookieParser from 'cookie-parser';
import edenredRouter from './Routes/Webapp/edenredRouter.js';


dotenv.config()

const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true),
    next()
  })
app.use(cors({origin:["http://localhost:3000", "https://www.jilswebapp1.pikkopay.fr", "https://www.jilswebapp.pikkopay.fr", "https://www.test.pikkopay.fr"]}))
app.use(express.json())
app.use(cookieParser())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true),
    next()
})

/* Connection à MongoDB */

const client = mongoose.connect(
    `mongodb+srv://Joe:Stardown@cluster0.4ypza.mongodb.net/storesProducts?retryWrites=true&w=majority`, 
    // `mongodb+srv://admin:Gukaf37ghwFJ2ErzvK49@mongodb-3e0e3fcb-o7ff0aa2a.database.cloud.ovh.net/storesDatabase?replicaSet=replicaset&tls=true&authSource=admin`,

    {useNewUrlParser: true, useUnifiedTopology : true},
    (err) => {
        if (!err) console.log("Connexion à MongoDb réussie !");
        else console.log("connection error :" + err);
    }
)
app.get('/accessToken', (req, res) => {
    accessToken(req, res)
})
app.use('/track', trackRouter)
app.use('/store', storeRouter)
app.get('/refresh', (req, res) => {
    handleRefreshToken(req, res)
})

// app.use(verifyJWT)

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/stripe', stripeRouter);
app.use('/mail', mailRouter);
app.use('/edenred', edenredRouter)

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