import axios from "axios";
import qs from 'qs'

const auth_client_id = process.env.EDENRED_AUTH_CLIENT_ID
const auth_client_secret = process.env.EDENRED_AUTH_CLIENT_SECRET

export const getToken = async (code) => {

    var data = qs.stringify({
    'code': code,
    'client_id': auth_client_id,
    'client_secret': auth_client_secret,
    'redirect_uri': 'http://localhost:3000/cart',
    'grant_type': 'authorization_code' 
    });

    var config = {
    method: 'post',
    url: 'https://sso.sbx.edenred.io/connect/token',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        // 'Authorization': 'Bearer B917ACB943BB87E24465DF472410034FF9E533B0C4ABB2751A27AE9017CD8637', 
        // 'Cookie': '.AspNetCore.Culture=c%3Den%7Cuic%3Den; TS01f26959=0111aad4555fe5511d89bca508d99c93ba6ca3da29f43720f75f5a2cec5775b6be534d937e58f242ae5163c660a86f2a23398d2c1387c5ce4471137601098d606b018b2a47'
    },
    data : data
    };
    const result = await axios(config)
    return result.data

}