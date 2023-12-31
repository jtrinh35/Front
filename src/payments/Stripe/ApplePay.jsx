import { PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import {Toast} from '../../components/Toast';
import { payOrder } from '../../actions/orderActions';
import {  getCartInfo, } from "../../actions/cartActions";

const ApplePay = (order, axiosInstance) => {

    ({order, axiosInstance} = order)
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()
    const [paymentRequest, setpaymentRequest] = useState(null);
    const [loadingaxios, setLoadingAxios] = useState(false)
    const [email1, setEmail1] = useState("");
    const [validemail, setValidemail] = useState(false)
    const [link, setLink] = useState(false) 

    const cart = useSelector((state) => state.cart);
    
    const { cartItems, loadingCart } = useSelector((state) => state.cart);

    let paymentIntent, email, promotion, pr

    const toPrice = (num) => (parseFloat(num).toFixed(2))
    const successPaymentHandler = (email1, order_amount) =>{  
        console.log("order dans le payment handler")
        console.log(order)
        dispatch(payOrder(order, email1, paymentIntent, axiosInstance, order_amount))
        /*.then(() => {
               dispatch(getCartInfo(order._id, axiosInstance));
               axiosInstance.put("/track/cartscreen", { id: order._id });})*/
    }
    const options = {
        paymentRequest,
        style: {
          paymentRequestButton: {
            type: 'default',
            // One of 'default', 'book', 'buy', or 'donate'
            // Defaults to 'default'
      
            theme: 'dark',
            // One of 'dark', 'light', or 'light-outline'
            // Defaults to 'dark'
      
            height: '50px',
            // Defaults to '40px'. The width is always '100%'.
          },
        }
      }
      console.log("--------order!!")
    console.log(order);
    useEffect(()=>{
        setLoadingAxios(true)
        let order_amount = order.itemsPrice;
    
        //order_amount = toPrice(order.itemsPrice)
        console.log("order amount1 : " + order_amount)
           
            if(stripe){
                
                pr = stripe.paymentRequest({
                    currency:'eur',
                    country: 'FR',
                    requestPayerEmail: true,
                    requestPayerName: true,
                    total: {
                        label:'PineapplePay',
                        amount: Math.round(order_amount * 100),
    
                    },
                })
                pr.canMakePayment().then((result)=>{   
                    setLoadingAxios(false)  
                    if(result){
                        console.log(result)
                        setpaymentRequest(pr);
                        setLink(true)
                    }
                })
                pr.on('paymentmethod', async(e)=>{
                        
                        try{   
                            setLoadingAxios(true)
                                console.log("tryinnggg")
    
                                let response;
                            
                                    response = await axiosInstance.post('/stripe/payment',
                                    {
                                        amount: order_amount,  
                                        storeId: order.storeId                    
                                    },
                                    );
                       
                                console.log("response")
                                console.log(response);
                                const data = await response.data; 

                               
                                     
                                const confirmPayment = await stripe.confirmCardPayment(data.clientSecret,
                                    {               
                                        payment_method: e.paymentMethod.id,
                                    },{
                                        handleActions: false
                                    }
                                )
                            
                                console.log("confirmPayment")
                                console.log(confirmPayment);

                                paymentIntent = confirmPayment.paymentIntent
                                e.complete('success');
                                console.log("paymentIntentstatus")
                                console.log(paymentIntent.status);
                                // console.log("paymentIntent status")
                                // console.log(paymentIntent.status);

                                if(paymentIntent.status === 'requires_action'){
                                   
                                    const three_d = await stripe.confirmCardPayment(data.clientSecret)
                                    console.log("three_d")
                                    console.log(three_d)  
                                    const {paymentIntent} = three_d;
                                    if(paymentIntent.status === 'succeeded'){
                                        console.log('2')
                                        const rep = await axiosInstance.post('/products', {
                                            id: paymentIntent.id
                                        })
                                        console.log(rep.data)
                                        localStorage.setItem('receipt_url', rep.data);
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
                                        console.log("order is paid ? : " + order.isPaid)
                                        console.log("order amount : " + order_amount)
                                        console.log("ORDER : ")
                                        console.log(order)
                                        //alert('hello')
                                        successPaymentHandler(email1, order_amount)
                                        localStorage.removeItem('cartItems')  
                
                                        //   ici
    
                                    }
                                    else{
                                        setLoadingAxios(false)
                                        Toast("error", "Paiement échoué")
                                        // toast.error("Paiement échoué1")
                                    }
                                }
                                if(paymentIntent.status === 'succeeded'){
                                   
                                    const rep = await axiosInstance.post('/products', {
                                        id: paymentIntent.id
                                    })
                                    localStorage.setItem('receipt_url', rep.data);
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
                                    console.log("order is paid 2? : " + order.isPaid)
                                    console.log("ORDER AMOUNT : ")
                                    console.log("order amount : " + order_amount)
                                    console.log("ORDER : ")
                                        console.log(order)
                                    //alert("hello2")
                                    successPaymentHandler(email1, order_amount)
                                    localStorage.removeItem('cartItems')
                
                                    // ici
    
                                }
                                else{
                                    if(paymentIntent.status !== "requires_action"){
                                        setLoadingAxios(false)
                                        Toast("error", "Paiement échoué")
                                        // toast.error("Paiement échoué2")
                                    }
                
                                }
                           
                            }
                                                
                            
                        catch(error){
                            setLoadingAxios(false)
                            Toast("error", "Paiement échoué")
                            // toast.error("Paiement échoué3")
                        }
        
                    }
                    // else{
                    //     setLoadingAxios(false)
                    //     toast.error("Email invalide")
                    // }

                    )
                    
            }
    
    }, [stripe, elements])

    return (
        <div>
            {loadingCart || loadingaxios? (
                <div>LOADING...</div>
            ) : (
                <>
                {/* <AgeRestriction data={order}/> */}
                
                {paymentRequest && <PaymentRequestButtonElement options={options}/>} 
                </>
            )}
        </div>
    );
};

export default ApplePay;