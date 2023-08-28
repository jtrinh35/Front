import axios from "axios";

export const getInstrument = async(token, instrumentId) => {

    const config = {
        method: 'GET',
        url: `https://sb-api.paygreen.fr/payment/instruments/${instrumentId}`,
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`
        }
      };
      
    const result = await axios(config)
    return result.data

}
