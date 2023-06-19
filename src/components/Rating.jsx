import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { comOrder } from '../actions/orderActions';


const Rating = (data) => {

    ({data} = data)
    const {loading, success} = useSelector(state => state.orderCom);
    const orderCom = useSelector(state => state.orderCom)
    const dispatch = useDispatch()
    const [rating, setRating] = useState(localStorage.getItem('rating'))
    const comment = async(com) => {
        const orderId = data.orderId
        const axiosInstance = data.axiosInstance
        await dispatch(comOrder(orderId, com, axiosInstance))
        setRating(localStorage.getItem('rating'))
    }

    const close = () => {
        var element = document.getElementById("rate")
        if(element.style.visibility === "hidden"){
            element.style.visibility = "visible"
        }else{
            element.style.visibility = "hidden"
        }
    }

    return (
        <>
        {loading ? (
            <>
            <div>Loading...</div>
            </>
        ) : (
            <div>
            {rating ? <div>VALIDÉ</div> : 
            <div id="rate" className='absolute min-w-full min-h-full flex justify-center items-center bottom-32 left-0 '> 
            <div className=' bg-white flex flex-col items-center px-8 pt-6 pb-10 rounded-3xl w-5/6' style={{ boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)" }}>
                
                
                <button  className='border-none self-start' onClick={close}><img src="/images/cross.png" alt="close" className='h-8'/></button>
                
                <div className=' flex flex-col items-center px-8'> 
                <h2 className='text-center mb-4'>
                    Rate your expérience
                </h2>
                <p className='text-center mb-8'>how was your experience with Scan & Go?</p>
                <div className='flex gap-8'>
                    <button className='border-none flex flex-col items-center gap-3' onClick={() => comment("Poor")}><img src="/images/poor.png" />Poor</button>
                    <button className='border-none flex flex-col items-center gap-3' onClick={() => comment("Average")}><img src="/images/average.png" />Average</button>
                    <button className='border-none flex flex-col items-center gap-3' onClick={() => comment("Good")}><img src="/images/good.png" />Good</button>
                    <button className='border-none flex flex-col items-center gap-3' onClick={() => comment("Excellent")}><img src="/images/excellent.png" />Excellent</button>
                </div>
                </div> 
            </div>
            </div>
            }           
        </div>
        )}
       </>
    );
};

export default Rating;