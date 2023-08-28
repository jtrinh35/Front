import axios from "axios";

const toPrice = (num) => Number(num.toFixed(2))
const pay_client_id = process.env.EDENRED_PAY_CLIENT_ID
const pay_client_secret = process.env.EDENRED_PAY_CLIENT_SECRET

export const transactionConfirm = async(authorized_amount, authorization_id) => {

    const date = new Date(Date.now())
    var data = JSON.stringify({
    "amount": authorized_amount,
    "tstamp": date
    });
    
    var config = {
    method: 'post',
    url: `https://directpayment.stg.eu.edenred.io/v2/transactions/${authorization_id}/actions/capture`,
    headers: { 
        'X-Client-Id': pay_client_id, 
        'X-Client-Secret': pay_client_secret, 
        'Content-Type': 'application/json'

    },
    data : data
    };
    const result = await axios(config)
    // console.log(result.data)

    return result.data
    
}