// import sgMail from '@sendgrid/mail';
// import express from 'express';
// import expressAsyncHandler from 'express-async-handler';


// const mailRouter = express.Router();
// mailRouter.use(express.json());

// sgMail.setApiKey('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')

// // sgMail.send(message)
// mailRouter.post('/',expressAsyncHandler(async (req, res) => {
//   const {order} = await req.body;
//   const {email} = await req.body
//   const{order_id} = await req.body
//   const{order_price} = await req.body
  
//   console.log(req.body)
//   console.log("email envoyé")
//   const order_ = JSON.stringify(order)
//   // console.log(JSON.stringify(req.body))
//   let message = {
//     to: email,
//     from:{name: 'Pineapplepay',
//     email:'pineapplepay@hotmail.com',
//         },
//     subject:'Reçu de commande',
//     templateId: "d-df24c3163ecf4ae883cfed992d007685",
//     dyanmic_template_data:{
//       order:order,
//       // order_id: order_id,
//       // order_price: order_price
//     }
//     }
//   sgMail.send(message)
// })
// );

// export default mailRouter;
import sgMail from '@sendgrid/mail';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';


const mailRouter = express.Router();
mailRouter.use(express.json());

sgMail.setApiKey('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')

// sgMail.send(message)
mailRouter.post('/',expressAsyncHandler(async (req, res) => {
    const {order} = await req.body;
    const {email} = await req.body;
    const {order_id} = await req.body;
    const {order_price} = await req.body
    let message = {
        to : email,
        from : {
          name: "PineapplePay",
          email: "pineapplepay@hotmail.com"
        },
        subject:'Reçu de commande',
        templateId : "d-df24c3163ecf4ae883cfed992d007685",
        dynamic_template_data:{
          order: order,
          order_id: order_id,
          order_price: order_price
        }
      }
    sgMail.send(message)
  })
);

export default mailRouter;