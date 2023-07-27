import axios from "axios";

const pay_client_id = process.env.EDENRED_PAY_CLIENT_ID
const pay_client_secret = process.env.EDENRED_PAY_CLIENT_SECRET

export const getBalance = async(userName, access_token) => {
    var config = {
        method: 'get',
        url: `https://directpayment.stg.eu.edenred.io/v2/users/${userName}/balances`,
        headers: { 
          'X-Client-Id': pay_client_id, 
          'X-Client-Secret': pay_client_secret, 
          'Authorization': `Bearer ${access_token}`, 
        }
      };

    const {data} = await axios(config)
    return data

    
}