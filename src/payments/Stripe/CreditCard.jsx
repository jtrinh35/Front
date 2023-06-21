import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { payOrder } from '../../actions/orderActions';
import {Toast} from '../../components/Toast';

const CreditCard = (order, axiosInstance) => {

    ({order, axiosInstance} = order)

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();

    const [email1, setEmail1] = useState("");
    const [validemail, setValidemail] = useState(false)
    const [loadingaxios, setLoadingAxios] = useState(false)

    const [focusedElement, setFocusedElement] = useState(null);

    const [payBtn, setPayBtn] = useState(true);


    let paymentIntent, email, promotion, pr
    


    const handleSubmit = async(order) =>{
        // if(AgeRestriction(order).props.children){
        //     console.log("illégal")
        //     return
        // }
        // else{
        setPayBtn(false);

        let order_amount = order.itemsPrice
        
        if(validemail || email1.length === 0)
        {
            try{           
                let response;
                setLoadingAxios(true)    
                if (email1){
                    response = await axiosInstance.post('/stripe/payment',
                {
                    amount: order_amount,
                    receipt_email: email1,
                    storeId: order.storeId
                },
                );
                }   
                else{
                    response = await axiosInstance.post('/stripe/payment',
                {
                    amount: order_amount,
                    storeId: order.storeId
                },
                );
                }    
                
    
                const data = await response.data;
                const cardElement = elements.getElement(CardNumberElement);
                const confirmPayment = await stripe.confirmCardPayment(data.clientSecret,
                    {                
                        payment_method: {card: cardElement}
                    }
                )
                paymentIntent = confirmPayment.paymentIntent
                console.log(paymentIntent)
                if(paymentIntent.status === 'succeeded'){
                    const rep = await axiosInstance.post('/products', {
                        id: paymentIntent.id
                    })
                    console.log(rep.data)
                    localStorage.setItem('receipt_url', rep.data)
                    if(validemail && email1.length>0){
                        
                        axiosInstance.post('/mail', {
                            order_price : order_amount,
                            email: email1,
                            order_id: order._id,
                            order: order.orderItems

                        })
                    }
                    setLoadingAxios(false)
                    Toast("success", "Paiement réussi")
                    // toast.success("Paiement réussi")
                    order.isPaid = true
                    successPaymentHandler(email1, order_amount)
                    localStorage.removeItem('cartItems')
    

                }
                else{
                    setLoadingAxios(false)
                    Toast("error", "Paiement échoué")
                    // toast.error("Paiement échoué")
                }
                }
                
            catch(error){
                    setLoadingAxios(false)
                    console.log("Error! ", error);
                    Toast("error", "Paiement échoué")
                    // toast.error("Paiement échoué")
                
            }
        }
        else{
            setLoadingAxios(false)
            Toast("error", "Email invalide")
            // toast.error("email invalide")
        }
        setPayBtn(true);
    }


    const handleFocus = (element) => {
        setFocusedElement(element); // Set the currently focused element
      };

const inputStyle = {
    color: 'rgba(0, 0, 0, 1)',

    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.5)',
    fontSize: '12px',
    },

  
}
const successPaymentHandler = (email1, order_amount) =>{  
    dispatch(payOrder(order, email1, paymentIntent, axiosInstance, order_amount));
}
    
    return (
        <div>
             <div id="stripe">
                            <div>
                                <h4 className="text-lg">Numéro de carte</h4>
                                <CardNumberElement className={`stripe_card ${focusedElement === 1 ? 'focused' : ''}`} options={{style: {base: inputStyle}}}  onFocus={() => handleFocus(1)} />  
                                {/* options={{style:{base:{'::placeholder': {color: '#FFFFFF'},}}}} */}
                            </div>                                        
                            <div className='pr-8'>  
                                <h4 className="text-lg">Date d'expiration</h4>                               
                                <CardExpiryElement className={`stripe_card ${focusedElement === 2 ? 'focused' : ''}`} options={{style: {base: inputStyle}}}  onFocus={() => handleFocus(2)}/>                                   
                            </div>  
                            <div className='pl-8'>
                                <h4 className="text-lg">Cryptogramme</h4>
                                <CardCvcElement className={`stripe_card ${focusedElement === 3 ? 'focused' : ''}`}  options={{style: {base: inputStyle}}}  onFocus={() => handleFocus(3)}/>
                            </div>                             
                        </div>

                      

            { payBtn ? <button className='pikko-btn rounded-full mt-4 py-6 justify-self-end pikko-btn w-full text-center' onClick={() => handleSubmit(order)}>PAY</button> : <>
            <div className='flex justify-center'>
                        <div class="lds-spinner scale-50"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> 
                        </div>
            
            </>} 
            
        </div>
    );
};

export default CreditCard;