import React, { useContext, useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { idActions } from '../actions/idActions';
import { createOrder } from '../actions/orderActions';
import Config from '../axios/Config';
import { ORDER_CREATE_RESET, ORDER_DETAILS_RESET } from '../constants/orderConstants';
import { useNavigate } from 'react-router-dom';
import { CART_EMPTY } from '../constants/cartConstants';
import { ID_RESET } from '../constants/idConstants';
import { getStore } from '../actions/storeActions';
import { STORE_RESET } from '../constants/storeConstants';
import useAxiosInterceptors from '../axios/useAxios';



const RedirectPage = () => {
    // if get store success alors GO 
   const navigate = useNavigate()
   const [reset, setReset] = useState(false);
    const id = useSelector(state => state.id)
    const {store} = useSelector(state => state.store)
    const {success, loading, order} = useSelector(state => state.orderCreate)

    // const axiosInstance = Config()
    const axiosInstance = useAxiosInterceptors()
    const dispatch = useDispatch()
    console.log(axiosInstance)

    
    const location = (new URLSearchParams(window.location.search)).get('ok')

    useEffect(() => {
        window.localStorage.clear()
        dispatch({type: CART_EMPTY})
        dispatch({type: ID_RESET})
        dispatch({type: ORDER_DETAILS_RESET})
        dispatch({type: ORDER_CREATE_RESET})
        dispatch({type: STORE_RESET})
        setReset(true);
     
    }, [])

    
    useEffect(() => {
        // if(order){
        //     dispatch(getClient(order.order.clientId, axiosInstance))
        //     dispatch(listMenus(axiosInstance)) 
        // }   
        console.log("location useEffect")
        dispatch(getStore(location, axiosInstance))  
        axiosInstance.post('/track/visit', {storeId: location});

    
    }, [location])

    useEffect(() => {
        console.log("order useEffect")
        if(store && reset){
            const orderCreate = {storeId: store.id, clientId: ""}
            console.log("new order stooore")
            try{
                dispatch(createOrder(orderCreate, axiosInstance))
            }catch(e)
            {
                console.log(e)
            } 
        }
       
    }, [store])

    console.log("--------order-------")
    console.log(order)
    return (
        <>
        {success ? <div>  {navigate('/scan')} </div> : 
        
        <> 
         <div id="loader" class="loader loader-default is-active"></div>
            {location ? <>
                <div id="loader" class="loader loader-default is-active"></div>
            </> : 
            <div id="loader" class="loader loader-default is-active" data-text="Scannez un QR code"></div>
            }
         </>
        } 
        </>
        // <>
        // {loading ? (
        //     <>
        //     <div id="loader" class="loader loader-default is-active"></div>
       
        //     </>
        // ) : (

        //         <>
        //             {success ?
                        
        //                 <>
                       
        //                     <div>
        //                     {navigate('/scan')}
        //                     </div>                     
    
        //                     </>
        //                 :(
        //                     <>
        //                     {location ? (
        //                         <>               
        //                         {/* <div id="loader" class="loader loader-default is-active"></div> */}
        //                         <div>{navigate('/scan')}</div>
        //                         </>
        //                     ) : (
        //                         <>
        //                         <div id="loader" class="loader loader-default is-active" data-text="Scannez un QR code"></div>
        //                         </>
                                
        //                     )}
                            
        //                     </>
        //                 )}
        //         </>

        //     )}
        
        // </>
    )
};

export default RedirectPage;

// <div id="loader" class="loader loader-default is-active" data-text="Scannez un QR code"></div>