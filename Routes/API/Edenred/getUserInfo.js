import axios from "axios";

export const getUserInfo = async (access_token) => {
    var config = {
        method: 'get',
        url: 'https://sso.sbx.edenred.io/connect/userinfo',
        headers: { 
          'Authorization': `Bearer ${access_token}`, 
        //   'Cookie': '.AspNetCore.Culture=c%3Den%7Cuic%3Den; TS01f26959=0111aad4557c7381afdb0312a9acbe2a7ca1ab64de84cd794b813a4bd88816c64ea57596dc5d78c68949ccf66092d9b38488c2cc772be732cc2ea18f583f1756285dbcf4c2'
        }
      };
    const {data} = await axios(config)
    return data
}