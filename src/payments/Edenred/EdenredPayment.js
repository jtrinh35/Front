import useEdenredInterceptors from "../../axios/edenredAxios/useEdenredAxios";

export const EdenredCapture = async(order_amount, order, edenredInstance) => {
    
    const paymentAuthorization = await edenredInstance.post('/edenred/capture', {
        order: order,
        amount: order_amount, 
        edenred: localStorage.getItem('Edenred')
    })
    return {paymentAuthorization}
}

export const EdenredConfirm = async(authorized_amount, authorization_id ,edenredInstance) => {
    console.log(authorization_id)
    console.log(authorized_amount)
    const paymentConfirm = await edenredInstance.post('/edenred/payment', {
        authorized_amount: authorized_amount, 
        authorization_id: authorization_id
    })
    console.log(paymentConfirm)
    return paymentConfirm

}

export const EdenredCancel = async(authorized_amount, authorization_id ,edenredInstance) => {

    const paymentCancel = await edenredInstance.post('/edenred/cancel', {
        authorized_amount: authorized_amount, 
        authorization_id: authorization_id
    })
    return paymentCancel

}

