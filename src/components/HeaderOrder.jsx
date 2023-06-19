import React from 'react';
import { Link } from 'react-router-dom';

const HeaderOrder = () => {


    return (
        <header>
            <div className="rowcart" >
                <div className="leftheaderbackscan">
                    <Link id="link_scan" to ="/cart">
                        <img id="logoback" src="/images/back2.png" alt="scan" />
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

            </div>
        </header>

    );
};

export default HeaderOrder;