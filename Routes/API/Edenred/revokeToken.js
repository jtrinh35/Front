import axios from "axios";
import qs from 'qs'

const auth_client_id = process.env.EDENRED_AUTH_CLIENT_ID
const auth_client_secret = process.env.EDENRED_AUTH_CLIENT_SECRET

export const revoke_token = async (refresh_token) => {
    
    var data = qs.stringify({
        'token_type_hint': 'refresh_token',
        'token': refresh_token,
        'client_id': auth_client_id,
        'client_secret': auth_client_secret 
      });
      var config = {
        method: 'post',
        url: 'https://sso.sbx.edenred.io/connect/revocation',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
      };

    await axios(config);
    return {message:'revocation success'}

}