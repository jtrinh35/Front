import axios from "axios";

const toPrice = (num) => Number(num.toFixed(2))
const pay_client_id = process.env.EDENRED_PAY_CLIENT_ID
const pay_client_secret = process.env.EDENRED_PAY_CLIENT_SECRET

export const transactionCapture = async(order, amount, edenred) => {
    const date = new Date(Date.now())
    var data = JSON.stringify({
        "order_ref": order._id,
        "mid": process.env.EDENRED_MID,
        "amount": toPrice(parseFloat(amount))*100,
        "security_level": "standard",
        "capture_mode": "manual",
        "tstamp": date
      });
      
      var config = {
        method: 'post',
        url: 'https://directpayment.stg.eu.edenred.io/v2/transactions',
        headers: { 
          'X-Client-Id': pay_client_id, 
          'X-Client-Secret': pay_client_secret, 
          'X-Session-Id': edenred.session, 
          'Authorization': `Bearer ${edenred.access_token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

    const result = await axios(config)
    const auth_id = result.data.data.authorization_id
    console.log(auth_id)
    var data_ = JSON.stringify({
        "order_ref": order._id,
        "mid": process.env.EDENRED_MID,
        "amount": toPrice(parseFloat(amount))*100,
        "security_level": "standard",
        "capture_mode": "manual",
        "tstamp": date
      });
      
    var config_ = {
        method: 'post',
        url: `https://directpayment.stg.eu.edenred.io/v2/transactions/${auth_id}/actions/cancel`,
        headers: { 
          'X-Client-Id': pay_client_id, 
          'X-Client-Secret': pay_client_secret, 
          'X-Session-Id': edenred.session, 
          'Authorization': `Bearer ${edenred.access_token}`, 
          'Content-Type': 'application/json'
        },
        data : data_
      };
    await axios(config_)
    return result.data
      
    
}