import axios from "axios";

export const createBuyer = async (token, firstName, lastName, email) => {


    const config = {
    method: 'POST',
    url: 'https://sb-api.paygreen.fr/payment/buyers',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
    },
    data: {first_name: firstName, last_name: lastName, email: email}
    };

    const result = await axios(config)
    return result.data

}