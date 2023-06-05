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