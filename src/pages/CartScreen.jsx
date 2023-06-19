import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { createOrder, detailsOrder } from '../actions/orderActions';
import HeaderCart from '../components/HeaderCart'
import { ORDER_CREATE_RESET, ORDER_DETAILS_RESET } from '../constants/orderConstants';
import Config from '../axios/Config';
import useAxiosInterceptors from '../axios/useAxios';
import Stripe from '../payments/Stripe/StripePayment'
import RestrictedProducts from '../components/AgeRestriction/RestrictedProducts';
import { CART_EMPTY } from '../constants/cartConstants';
import FooterNavbar from "../components/FooterNavbar"

const CartScreen = () => {

    window.scrollTo(0, 0);
    localStorage.setItem('promoSolde', false);

    // const date = Time()

    // const axiosInstance = Config()
    const axiosInstance = useAxiosInterceptors()
    const navigate = useNavigate();
    const toPrice = (num) => (parseFloat(num)).toFixed(2)

    const [promotion, setPromotion] = useState()
    const [promoprice, setPromoprice] = useState(0)
    const [promoPizz, setPromoPizz] = useState(false)
    const [pricePizz, setPricePizz] = useState(0)
    const [promoBoisson, setPromoBoisson] = useState(false)
    // const orderCreate = useSelector(state => state.orderCreate)
    const {order} = useSelector(state => state.orderCreate.order) || {}

    const cart = useSelector(state => state.cart)
    const {cartItems} = cart
    // cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
    // cart.promoprice = promoprice

    const {success, loading} = useSelector(state => state.orderDetails);
    const orderDetails = useSelector(state => state.orderDetails.order)
    const orderPay = useSelector(state => state.orderPay)
    const dispatch = useDispatch();
    const [clientInfo, setClientInfo] = useState([])
    const storeId = useSelector(state => state.store.store.id)
    const {store} = useSelector(state => state.store)

    const [checkedValues, setCheckedValues] = useState([]);

    useEffect(() => {
        if(order){
            axiosInstance.put('/track/cartscreen', {id: order._id});
        }
    }, [])
    
    
    const addToCartHandler = (product) => {
        
        dispatch(addToCart(order._id, product, 1 ,axiosInstance));
        
    }

    /*async function removeFromCartHandler(Code_Barre, qty){

        const product = orderDetails.orderItems.filter(x => x.Code_Barre === Code_Barre)[0];
        console.log("producttodelete");
        
        console.log(product);
        const data = await dispatch(removeFromCart(Code_Barre, order._id, product, axiosInstance, qty));  
        // console.log(cart.cartItems.filter(x => x.index === index)[0].product)
    }*/

    async function removeFromCartHandler(product_qty){

        const cbarre_qty = product_qty.map(({ product, qty }) => ({
            Code_Barre: product.Code_Barre,
            qty: qty
        }));



        console.log("---product_qty---")
        console.log(product_qty)
        const data = await dispatch(removeFromCart(cbarre_qty, order._id, product_qty, axiosInstance));
        setCheckedValues([]);  
        // console.log(cart.cartItems.filter(x => x.index === index)[0].product)
    }

    const truncate = (str, n) => {
        return (str.length > n) ? str.slice(0, n-3)+'...' : str;
    };
      
    
    const applyPromotion = () => {
        setPromotion(true)
    }

    useEffect(() => {
        if(orderDetails){
            if(!cartItems || orderDetails.orderItems.length !== cartItems.length){
                cart.cartItems = orderDetails.orderItems
            }
            // orderDetails.isPaid ? navigate(`/ordersuccess/${orderDetails._id}`) : <></>
            orderDetails.isPaid ? navigate(`/ScanCheck`) : <></>
        }

    }, [orderPay])

    useEffect(() => {
       
        if(order){
            dispatch(detailsOrder(order._id, axiosInstance))   
            
        }
    }, [cart, orderPay])

    const handleCheckboxChange = (item) => {
        const isChecked = checkedValues.some((val) => val.product === item);
      
        if (isChecked) {
          // Uncheck the checkbox and remove the value from state
          setCheckedValues(checkedValues.filter((val) => val.product !== item));
        } else {
          // Check the checkbox and add the value to state
          const newCheckedValue = { product: item, qty: item.Qty };
          setCheckedValues([...checkedValues, newCheckedValue]);
        }
      };

    // useEffect (()=>{    
    //     if(promotion)
    //     {                     
    //         // cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
    //         // toPrice(cartItems.reduce((a,c) => a+c.price, 0)) - soldeClient < 1 ? 
    //         // setPromoprice(1)    
    //         // : setPromoprice(toPrice(toPrice(cartItems.reduce((a,c) => a+c.price, 0)) - soldeClient))  
    //         // cart.soldePrice = true          
    //     }
    //     else{       
    //         cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
    //         cart.soldePrice = false
    //         setPromoprice(0)
    //     }
    // },[promotion, cartItems.length, cart, promoprice, promoPizz, clientInfo, pricePizz])


    return (
    <>
    {loading || !orderDetails ? (<div className="loader loader-default is-active"></div>) : (
        <>
        {order === undefined ? (
            <>
                {navigate('/')}
            </>
        ) : (
            <div className="cartscreen"> 
            <HeaderCart/>
           
            {orderDetails.orderItems.length === 0 ? 
            (
            <>
            <Link className="cart_empty text-2xl absolute w-full h-full top-52 text-center px-12 " to="/scan">Panier vide, scannez ce que vous désirez pour le remplir !</Link>
            <FooterNavbar props={{cart:true}}/>
            </>
            ):
            (      
                <>
                {orderDetails ? (
                    <>
                    <div className='min-h-fit px-12 pb-64'>
                        <div className="flex justify-between"> 
                        <h3 className="text-3xl">Product</h3>
                        {checkedValues.length > 0 ? (
                        <button className='border-none' onClick={()=> removeFromCartHandler(checkedValues)}>
                            <img className=" h-8 w-auto" src="/images/delete.png" alt="delete"/>
                        </button>
                        ): <></> }
                        </div>
                    <ul className="ulcartlist">
                            {
                                orderDetails.orderItems.map((item) =>(
                                    
                                    <li key={item.index}>
                                        <div className ="cart_list py-8 flex justify-evenly items-center " style={{borderColor: item.CountInStock}} >
                                        <input type="checkbox" value={item.Code_Barre} checked={checkedValues.some((val) => val.product === item)} onChange={() => handleCheckboxChange(item)}/>
                                            <div className="productimage">
                                            <img src={item.image} 
                                            // alt={item.name} 
                                            className="h-20">
                                            </img>
                                            </div>

                                            <div className="productdescription py-4 ml-4">
                                                {/* <div>
                                                    {RestrictedProducts.includes(item.category) && store.ageRestriction === "exit_checkout" ? 
                                                    // exit_checkout ou password
                                                    <div>!!!! A checker</div> : 
                                                    <></>
                                                    }
                                                </div> */}
                                                <div className = "min-30 text-left Break Words ">
                                                <p className='mb-1 w-40'  >{truncate(item.name, 26)} </p>
                                                    <p className='text-black'> <strong>
                                                    {toPrice(item.price).replace('.', ',')} €  </strong></p>
                                                </div>
                                                
                                            </div>

                                            <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                                                    <button className='border-none pr-4 minusBtn relative' onClick={() => removeFromCartHandler([{product :item, qty :1}])}>-</button>
                                                    { item.Qty}  
                                                    <button className=' top-1 border-none pl-4 relative top-px relative plusBtn '  onClick={() => addToCartHandler(item)}>+</button>                                                  
                                            </div>
                
                                            {/* <div className="productdelete">
                                                <button 
                                                id="buttondelete"
                                                type="button" 
                                                onClick={() => removeFromCartHandler(item.Code_Barre, item.Qty)}>
                                                <img src="/images/delete.png" alt="delete" id="remove"/>
                                                </button>
                                            </div> */}
                                        </div>
                                    </li>
                                ))
                            }
                            
                        </ul>
                        <div className="footercart mt-20 pt-6 px-8" disabled={orderDetails.orderItems.length === 0} >
                            
                            <div className="recap_cart text-black">
                                <div className="pt-4 flex justify-between items-center flex-nowrap">                     
                                    <div className="text-xl">
                                        Bag Total:&nbsp;
                                    </div>
                                    
                                    <div className="recap_cart2_price_ text-3xl">                                   
                                        {(toPrice(orderDetails.itemsPrice)).replace('.', ',')}€             
                                    </div>

                                                                                            
                                </div>
                            </div>     

                        </div>
                        <Stripe/>
                </div> 
                <FooterNavbar props={{cart:true}}/>
                </>
                ) : ( 

                <>
                    <div id="loader" class="loader loader-default is-active" data-text="Chargement des données"></div>
                </>
                )}

                </>
            
            )}
            </div>        
            )}

        </>
    )}
    
   
    </>
    );

};

export default CartScreen;

