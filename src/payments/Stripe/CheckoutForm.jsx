import React, {useEffect, useState} from 'react';
import Config from '../../axios/Config';
import useAxiosInterceptors from '../../axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { payOrder } from '../../actions/orderActions';
import { CART_EMPTY } from '../../constants/cartConstants';
import Toast from '../../components/Toast';
import HeaderOrder from '../../components/HeaderOrder';
import {useStripe, useElements, PaymentRequestButtonElement, CardNumberElement, CardCvcElement, CardExpiryElement} from '@stripe/react-stripe-js';
import {useNavigate} from 'react-router-dom'
import { cartReducer } from '../../reducers/cartReducers';
import Rating from '../../components/Rating';
import CreditCard from './CreditCard';
import ApplePay from './ApplePay';
import RestrictionPopup from '../../components/AgeRestriction/RestrictionPopup';


const CheckoutForm = () => {
    
    const toPrice = (num) => (parseFloat(num).toFixed(2))
    const navigate = useNavigate();
    // const axiosInstance = Config()
    const axiosInstance = useAxiosInterceptors()
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();

    const orderDetails = useSelector( state => state.orderDetails);
    const {store} = useSelector(state => state.store)
    const [paymentRequest, setpaymentRequest] = useState(null);
    const [loadingaxios, setLoadingAxios] = useState(false)
    const [email1, setEmail1] = useState("");
    const [validemail, setValidemail] = useState(false)
    // const [promotion, setPromotion] = useState(false)
    const [applepay, setApplepay] = useState(true)   
    const [restricted, setRestricted] = useState(false) 
    const [display, useDisplay] = useState(true)
    const cart = useSelector(state => state.cart) 

    let paymentIntent, email, promotion, pr
    
    const {order} = orderDetails;


    function getData1(val){
        setEmail1(val.target.value)
    }
    function checkmail(){

        if(/\S+@\S+\.\S+/.test(email1)){
            setValidemail(true)
        }
        else{
            setValidemail(false)
            Toast("error", "email invalide")
        }
    }


    // checkout_payment
    const popup = () => {
        if(applepay === true){
            setApplepay(false)
        }
        else{
            setApplepay(true)
            }
             
    }

    useEffect(() => {
        console.log(orderDetails.order.ageRestriction)
        orderDetails.order.ageRestriction === "toCheck" ? setRestricted(true) : setRestricted(false)

    }, [orderDetails])

    function payer(){

        return(
            <div className="buy_now">
                Payer {toPrice(order.itemsPrice).replace('.', ',')}€
            </div>
        )
        
        
    }
    
    const button_email = ()=>{
        Toast("error", "email invalide")
        // toast.error("email invalide")
      }

    const checkbox = () => {
        
    // var doc = document.getElementById('checkbox_mail').checked
    // if(doc){
    //     document.getElementById('input_mail').value = client.mail
    //     setEmail1(client.mail)
    // }
    // else{
    //     setEmail1("")
    //     document.getElementById('input_mail').value = ""

    // }
    }


    return (
        <> 
            {applepay ? 
                <>
                <div>
                        <div className='flex flex-col mt-10'>
{/* 
                        <div class="flex justify-between text-xl pb-2" style={{fontFamily:'poppinslight'}}>
                            <div>sous-total</div>
                            <div>{toPrice(orderDetails.order.itemsPrice).replace('.', ',')}€</div>
                        </div> */}
                        
                        {/* <div class="flex justify-between text-xl pb-6" style={{fontFamily:'poppinslight'}}>
                            <div>promotions</div>

                                <div>0,00€</div>

                        </div>
                                            
                        <hr class="relative border border-solid border-black"/>

                        <div className="recap_cart py-6">
                                <div className="recap_cart2 pt-4">     
                                       
                                <>
                                <div className="recap_cart2_total">
                                    Total:&nbsp;
                                </div>
                                <div className="recap_cart2_price_">                                 
                                    {toPrice(order.itemsPrice).replace('.', ',')}€ 
                                    </div>
                                </>
                                
                                                                                  
                                </div>
                        </div>      */}
                        {store.ageRestriction === 'password' && restricted ? (
                            <>
                            <RestrictionPopup/>
                            </>
                        ) : (
                            <>
                            <ApplePay order={order} axiosInstance={axiosInstance}/>                                                                             
                            <div className='pikko-btn rounded-full mt-14 mb-12 py-5 justify-self-end pikko-btn w-full text-center'  onClick={popup}>
                                Pay Now                                                             
                            </div>   
                            </>
                        )}
                            
                    </div>
                  
                        
                </div>

                </>
            :
            (
                <>
                {/* <HeaderOrder></HeaderOrder> */}
                <div id="form" className='pt-4'>
                    {/* <div className='pl-4'>
                        <img src="/images/back_order.png" alt="logo" id="back_order" onClick={popup} className='h-6 w-auto'/>
                    </div>
                     */}
                    <div id="popup" className='fixed bottom-0 left-0 w-screen h-fit bg-white z-50 rounded-t-[16px] p-8 px-8'>

                        <button onClick={popup} className='border-none pb-4'><img src="/images/cross.png" alt="close" className='h-8'/></button>
                        {/* {validemail ? ( */}

                            <CreditCard order={order} axiosInstance={axiosInstance}/>

                        {/* ) : (
                            <>
                                
                                <input inputMode="email" placeholder="Votre adresse email" onInput={getData1} name="email"/>
                                <div>Entrez une adresse mail valide</div>
                                <button onClick={checkmail}>checkemail</button>
                            </>
                        )} */}
                    </div>
                    
                    </div>  

                </>
            )
            }
            
           
    
        </>
        );
    
};

export default CheckoutForm;
