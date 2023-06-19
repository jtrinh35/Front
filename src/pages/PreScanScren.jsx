import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../axios/Config';
import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import { createOrder } from '../actions/orderActions';
import Cookies from 'universal-cookie';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { AuthProvider } from '../context/authProvider';
import { authContext } from '../context/authProvider';
import useAxiosInterceptors from '../axios/useAxios';

let cookies = new Cookies();

const PreScanScreen = () => {

    // cookies.set('SESSIONID', '63714b111dd0cdf6a23f5a2b', {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))})
    window.scrollTo(0, 0);
    const {auth, setAuth} = useContext(authContext)
    const colors = ["#0088FE", "#00C49F", "#FFBB28"];
    const delay = 99999999999; 
    const [index, setIndex] = React.useState(0);

    
    const {success, loading, order} = useSelector(state => state.orderCreate) || {}
    const {store} = useSelector(state => state.store) || {}
    // const axiosInstance = Config()  
    const axiosInstance = useAxiosInterceptors()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const SESSIONID = cookies.get('SESSIONID')
    let orderCreate
    // const jwt = cookies.get('jwt')
    // const accessToken = jwt
    // axiosInstance.interceptors.request.use(
    //     config=>{
    //         config.headers.authorization = `Bearer ${accessToken}`
    //         return config
    //     }
    // )


    useEffect(async() => {
        const data = await axiosInstance.get('/accessToken') 
        setAuth(data.data)
        if(success){
            navigate('/scan')  
        }
    }, [success])

    const cParti = async() => {
        
        (orderCreate = {storeId: store.id, clientId: ""})
        
        try{
            dispatch(createOrder(orderCreate, axiosInstance))
            // const response = await axiosInstance.get('/refresh');
        }catch(e)
        {
            console.log(e)
        }

          
    }

    return (
        <>
            {loading ? (
                <>
                    <div className="loader loader-default is-active"></div>
                </>

            ) : (
                <div className='relative h-screen w-full bg-black' id="bg-gradient">

                        <>
                        <div className='relative top-10 px-16'>

                            <div className='bg-white flex flex-col items-center relative top-40 py-14 px-12 rounded-2xl shadow-2xl px-4 gap-10'>
                                <div className='text-3xl text-center' style={{fontFamily:'poppinsmedium'}}>
                                    Scanne le code barre de tes produits
                                </div>
                                <img src="images/prescan.png" alt="scanbarcode" className='h-auto w-56'/>
                                <button onClick={cParti} className='text-4xl border-none bg-black text-white px-24 py-4 rounded-full'
                                style={{fontFamily:'poppinssemibold'}}>
                                    {/* GO ! */}
                                </button>
                                
                            </div>
                        </div>
                            
                        </>
                        

                </div>

            )}

        
        </>

    );
};

export default PreScanScreen;