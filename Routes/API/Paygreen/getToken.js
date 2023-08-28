import axios from "axios";

export const getToken = async () => {

    var config = {
        method: 'post',
        url: 'https://sb-api.paygreen.fr/auth/authentication/sh_7202191a431544b98494ed0c2932ada7/secret-key',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': 'sk_c15c85a26df34fa8b1f51f190dc2701c'
        },
      };
    const result = await axios(config)
    return result.data

}