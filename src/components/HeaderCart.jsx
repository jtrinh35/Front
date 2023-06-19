import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HeaderCart = () => {

    const cart = useSelector(state => state.cart)
    const orderDetails = useSelector(state => state.orderDetails.order)


    return (
        <header>
            
            {/* <div className='w-full px-10 mt-14 flex items-center gap-20'>
                <Link to='/scan' style={{zIndex:'40'}}>
                    <img src="/images/back2.png" alt="back" className='w-14 h-auto' />
                </Link>
                
            </div> */}
            <div className='relative my-16 text-center'>
                <div className=' flex justify-center items-end relative'>
                    {/* <img src="/images/Logo_Pineapple.png" alt="PikkoPay" className='h-16 w-auto'/>
                    <div className='relative' style={{bottom: '-4px', fontFamily:'poppinsmedium'}}>
                        <span className='text-white'>Pikko</span>
                        <span style={{color:'#FFE163'}}>Pay</span>
                    </div> */}
                    <h2 className='text-4xl'>My Cart </h2> 
                    {orderDetails.orderItems.length > 0 ? (
                    
                    
                    <span className='text-2xl pl-2'>({orderDetails.orderItems.map(product => product.Qty).reduce((a, b) => a + b )}) </span>
                    
                   
                ) : (
                    <></>
                )}
                    {/* <span className='text-2xl'> (  ) </span> */}
                </div>
                
                {/* {orderDetails.orderItems.length > 0 ? (
                    <>
                    {orderDetails.orderItems.map(product => product.Qty).reduce((a, b) => a + b ) > 1 ? (
                        <div className='text-2xl'>{orderDetails.orderItems.map(product => product.Qty).reduce((a, b) => a + b )} articles</div>
                    ):(
                        <div className='text-2xl'>{orderDetails.orderItems.map(product => product.Qty).reduce((a, b) => a + b )} article</div>
                    )}
                    </>
                ) : (
                    <></>
                )} */}

                
            </div>


        </header>

    );
};

export default HeaderCart;