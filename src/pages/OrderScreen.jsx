import Config from '../axios/Config';
import useAxiosInterceptors from '../axios/useAxios';
import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams} from 'react-router-dom';
import { detailsOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import {useNavigate} from 'react-router-dom'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import CheckoutForm from '../payments/CheckoutForm';


const OrderScreen = () => {

  window.scrollTo(0, 0);
  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors()
  const {orderId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const orderDetails = useSelector((state)=>state.orderDetails);
  const orderPay = useSelector((state) => state.orderPay);
  const {order, loading} = useSelector(state => state.orderDetails)
  const {client} = useSelector(state => state.client) || {}
  const {store} = useSelector(state => state.store) || {}
  const cart = useSelector(state => state.cart) //prendre le state de cart de redux store
  const {success: successPay} = orderPay;
  const [sdkReady, setSdkReady] = useState(true)
  const [content, setContent] = useState(true)
  const [promotion, setPromotion] = useState(false)
  const [soldeClient, setSoldeClient] = useState(0)
  const {cartItems} = useSelector(state => state.cart)

  const toPrice = (num) => (parseFloat(num).toFixed(2))

  useEffect(() => {
    if(order){
        axiosInstance.put('/track/orderscreen', {id: order._id});
    }
}, [])

  useEffect(()=>{
    if(order){
      if(order.isPaid){
        navigate(`/ordersuccess/${order._id}`)  
      }
    }
  }, [order, cart])

  useEffect(()=>{
    const callMail = async() =>{
      setSdkReady(false)
      await axiosInstance.post('/mail', 
      {
        order: order.orderItems,
        order_id: order._id,
        email:order.email,
        order_price: order.itemsPrice,
      }
    )}
    if(!order || successPay || (order && order._id !== orderId)){
      dispatch({type: ORDER_PAY_RESET})
      dispatch(detailsOrder(orderId, axiosInstance))
    }
    else{
      if(order.isPaid){
        if(sdkReady){
          if(order.email)
          callMail()
        }
        else{
          setSdkReady(false)
        }
      }
    }     
  },[dispatch, order, orderId, sdkReady, successPay]) 

  useEffect(() => {
    dispatch(detailsOrder(orderId, axiosInstance))
  }, [])

  useEffect(() => {
    if(client && client.account){
      for(var i = 0; i<client.solde.length; i++){

        if(client.solde[i].storeId === store.id){
            setSoldeClient(client.solde[i].solde)
            console.log(soldeClient)
        }
        else{
            setSoldeClient(0)
        }

    }
    }

}, [client])

  const changeContent = () => {
    content ? setContent(false) : setContent(true)
  }

  const applyPromo = () => {

    if(localStorage.getItem('promoSolde') === 'false'){
      console.log(localStorage.getItem('promoSolde'))
      localStorage.setItem('promoSolde', true);
      setPromotion(true)
    }
    else{
      localStorage.setItem('promoSolde', false);
      setPromotion(false)
    }
    window.location.reload()
  }

  const stripe = loadStripe(
    'pk_test_51K7i0KDpRgB6XXl9RyZSm0SOAorrK3qP3LN47vKGjVnNsbDG5Mc46c8UGPW9QuW2tPIWex1QN7Ox5ITLHHlnDibZ00nQpru6sm'
    );
  // const stripe = loadStripe(
  //   'pk_live_51K7i0KDpRgB6XXl9Z0XcWHCsCVMLlmUZjRaOAPCWww5hU6UlVIrCi9uZuHyDMbTHdEXbb8KYr5SY6Bo16gEgUaLo00v8GKEJ5d'
  //   );


    return loading ? (
      <div className="loader loader-default is-active"></div>
      ) : (

      <div className='h-screen w-full overflow-auto flex flex-col' style={{fontFamily: "poppinsregular", background: "linear-gradient(167.51deg, #FFBA88 -14.16%, #FF627F 158.21%)"}}>

        <div className='' style={{backgroundColor: "FFFEF1"}}>

        <header className='pt-12' style={{height: '90px'}}>

            <div className='flex pl-10 items-center relative' style={{zIndex:'99999'}}>
                <Link to ="/cart" className=''>
                    <img src="/images/back2.png" alt="scan" className='h-14 w-auto'/>
                </Link>
            </div>
            <div className='relative left-0 text-center relative bottom-16'>

              <div style={{fontFamily:"poppinsregular"}} className='text-3xl flex justify-center items-end relative bottom-6'>
                  <img src="/images/Logo_Pineapple.png" alt="PikkoPay" className='h-16 w-auto'/>
                  <div className='relative' style={{bottom: '-4px', fontFamily:'poppinsmedium'}}>
                      <span className='text-white'>Pikko</span>
                      <span style={{color:'#FFE163'}}>Pay</span>
                  </div>
              </div>
                   
            </div>

        </header>
        
          <>  
            <div className='bg-white rounded-3xl py-14 ml-14 mr-14 flex flex-col text-center justify-between' 
              style={{height:'240px', boxShadow:'0px 4px 26px rgba(0, 0, 0, 0.25)'}}>  
              <div className='text-5xl' style={{fontFamily:'poppinsmedium'}}>
                Total à payer
              </div>         
              <div id='textgradient2' className='text-9xl mt-4' style={{fontFamily: 'poetsen_oneregular', height:'300px'}}>
                {toPrice(order.itemsPrice).replace('.', ',')}€
              </div>
              <div className='' style={{fontFamily:'poppinsregular', fontSize:'13px'}}>
                {cartItems.length > 1  ? 
                  <div>Tu as {cartItems.length} articles dans ton panier !</div> : 
                  <div>Tu as {cartItems.length} article dans ton panier !</div>
                }
              </div>
            </div>
          </>
        
        
        </div>
        <div className='mt-20 pt-8 px-12 flex-1 pb-72 bg-white'id="invoice2" style={{borderRadius: "50px 50px 0px 0px"}}>
          <div >             
            {!order.isPaid && (
                <>
                  {<Elements stripe={stripe} >
                      <CheckoutForm/>
                  </Elements>}
                </>
              )} 
          </div> 
        </div>     
      </div>

      );
}

export default OrderScreen;

