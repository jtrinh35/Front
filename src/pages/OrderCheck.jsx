import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams} from 'react-router-dom';
import { detailsOrder} from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import { useNavigate } from 'react-router';
import Config from '../axios/Config';
import useAxiosInterceptors from '../axios/useAxios';
import { CART_EMPTY } from '../constants/cartConstants';
import { ID_RESET } from '../constants/idConstants';
import { BounceLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OrderCheck = () => {

  toast.configure({
    position: "bottom-right",
    theme: "colored",
    pauseOnFocusLoss: false,
    pauseOnHover: false,

  });
  const toPrice = (num) => (parseFloat(num).toFixed(2))
  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors()
  const {orderId} = useParams();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const [loading1, setLoading1] = useState(true)
  const navigate = useNavigate()
  const {store} = useSelector(state => state.store)
  const [validemail, setValidemail] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if(orderId){
      setLoading1(true)
      dispatch(detailsOrder(orderId, axiosInstance))  
      setLoading1(false)
         
    }
}, [orderId])

  useEffect(() => {
    if(order){
      if(order.isPaid === false){
        navigate(`/order/${order._id}`)
      }
    }
  }, [])

  const dispatch = useDispatch();

  const validation = async() => {
    
    setLoading1(true)
    await axiosInstance.put(`orders/${orderId}/validation`);
    setLoading1(false)
  }


  useEffect(()=>{
    dispatch({ type: ORDER_PAY_RESET });
    dispatch(detailsOrder(orderId, axiosInstance))
    dispatch({type: CART_EMPTY})
    dispatch({type: ID_RESET})
  },[orderId, dispatch, loading1]
  )


  const invite = () =>{
    var element = document.getElementById("invite")
    if(element.style.visibility === "hidden"){
        element.style.visibility = "visible"
    }else{
        element.style.visibility = "hidden"
    }
  }
  const mail = async() => {
    if(!validemail){
      toast.error('email invalide')
    }
    else{
      setLoading1(true)
      const msg = await axiosInstance.post('/mail', {
          order_price : orderDetails.order.finalPrice,
          email: email,
          order_id: orderDetails.order._id,
          order: orderDetails.order.orderItems,
          // clientId: orderDetails.order.clientId,
          store_name: store.name
        })
      setLoading1(false)
      if(msg.data.message === 'email sent'){
        localStorage.setItem('mail', 'sent')
        toast.success(msg.data.message)
      }
      else{
        toast.error(msg.data.message)
      }
    }
    

  }

  function getData(val){
    setEmail(val.target.value)
    if(/\S+@\S+\.\S+/.test(val.target.value)){
      setValidemail(true)
    }
    else{
        setValidemail(false)
    }
}
var date = new Date();
var current_date = date.getFullYear()+"-"+("0" + (date.getMonth() + 1)).slice(-2)+"-"+ date.getDate();


  return loading || loading1 ? (<>
    <div className="loader loader-default is-active"></div>
    </>
    ) : (
    
    <>
    {order.paidAt ? (
      
    <div id="checkscreen" className="checkscreen flex flex-col items-center">

      <img src="/images/confetti.png" alt="confetti" className='absolute w-full h-auto'/>
     
      <div className='w-11/12 relative top-32 flex flex-col gap-8' style={{marginBottom:'200px'}}>
        <div className='flex flex-col text-center relative bottom-6'>
          <span style={{fontFamily:'poppinssemibold', fontSize: '35px'}} className=''>Paiement Validé</span>
        </div>
        <ul className="ulcartlist rounded-3xl py-20" style={{backgroundColor:"white", boxShadow: "0px 0px 37px rgba(0, 0, 0, 0.1)"}}>
          {/* <div className='flex absolute justify-center w-full' style={{top: "70px"}}>
            <BounceLoader color="#36d7b7" />
          </div> */}
          
          <div className="checklist-header">
            <div className='flex flex-col text-center px-10 gap-10'>
              
              <div className='flex flex-col rounded-lg py-6' style={{backgroundColor:'#F5F5F5'}}>
                <div className='flex justify-center items-center' style={{height:'100px'}}>
                  <span id='textgradient'style={{fontFamily:'poppinsbold', fontSize: '70px'}}> €{toPrice(order.itemsPrice).replace('.', ',')}</span>
                </div>
                <div className='flex flex-col w-full justify-between px-8' >
                  <div className='flex justify-between text-xl' style={{color:'#989898', fontFamily:'poppinsmedium'}}>
                    <span >DATE</span>
                    <span>HEURE</span>
                  </div>
                  <div className='flex justify-between text-2xl' style={{fontFamily:'poppinssemibold'}}>
                    {order.paidAt.slice(0,10) === current_date ? 
                    (
                      <span>Aujourd'hui</span>
                    ): (
                    <span className='flex'>
                      <span>{order.paidAt.substring(8,10)}</span>
                      <span>/</span>
                      <span>{order.paidAt.substring(5,7)}</span>    
                      </span>
                    )}
                  
                    <span className='flex'>
                      <span>{parseInt(order.updatedAt.substring(11,13))+1}</span>
                      <span>:</span>
                      <span>{order.updatedAt.substring(14,16)}</span> 
                    </span>
                  </div>
                </div>      
              </div>
               
           
            <hr />
            </div>
            
          </div>       
          {
              order.orderItems.map((item) =>(
                  <li key={item.index} className='mt-0'>
                    <div className ="flex w-full justify-between items-center text-center gap-6 px-14 pt-12 pb-6">
                        <div className="productimage">
                          <img src={item.image} 
                          alt={item.name} 
                          className="h-auto w-24">
                          </img>
                        </div>
                          
                        <div className = "text-2xl leading-8 text-left" style={{fontFamily:'poppinsmedium'}}>
                            <div>{item.name}</div>
                            {/* <div>POCKY SAVEUR MATCHA ET SAKURA</div> */}
                            <div style={{fontFamily: 'poppinsextrabold'}} className='text-5xl'>x {item.Qty}</div> 
                        </div>
                        <div id="" style={{fontFamily:'poppinsmedium', color: "#7D7D7D"}} className='text-2xl'>
                          {toPrice(item.price * item.Qty)}€
                        </div>
                        
                    </div>
                                
                  </li>
                  
              ))
          }
              
          </ul>
         {/* <div class="button-check-div">
         <button class="button-check" onClick={validation}>Valider</button>
         </div> */}
        </div>

      
    </div>
    ) : (
      <div className="loader loader-default is-active"></div>
    )}
       
   
  </>
  );
  return(
    <div></div>
  )
}
export default OrderCheck;

