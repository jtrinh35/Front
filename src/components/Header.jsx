import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {

    const {cartItems} = useSelector(state => state.cart)
    const orderDetails = useSelector(state => state.orderDetails.order)

    const help = () => {
        var element = document.getElementById("information")
        if(element.style.visibility === "hidden"){
            element.style.visibility = "visible"
        }else{
            element.style.visibility = "hidden"
        }
    }
    const cartLength = () => {
        let length;

        cartItems && cartItems.length > 0 ?  length = cartItems.map(product => product.Qty).reduce((a, b) => a + b ) : length = 0
        

        return length
    }
    return (
        <>
             <div id="information" className='absolute min-w-full min-h-full flex justify-center items-center bottom-32' style={{visibility:"hidden", zIndex:"9999"}}>

                <div className='bg-white rounded-xl w-5/6 flex flex-col justify-center text-center items-center gap-12 py-12 mt-40 px-14' 
                style={{height: "450px", boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)", }}
                >   
                    <div className='flex flex-col gap-2 text-black' id=''>
                        <div className='text-7xl' >En cas de</div>
                        <div className='text-7xl'>Problèmes</div>
                    </div>
                    <ul className='flex flex-col text-start gap-10 text-2xl list-decimal pl-6 pb-4' style={{fontFamily:'poppinsregular', color:'black'}}>
                        <li className='mt-0'>Réactualise ton navigateur web</li>
                        <li className='mt-0'>Autorise l'accès caméra du navigateur dans les paramètres du téléphone</li>
                        <li className='mt-0'>Vérifie ton accès internet</li>
                    </ul>
                
                    

                    {/* <div className='bg-black px-40 rounded-xl'> */}
                        <button className='payment_button' onClick={help} style={{fontFamily: "poppinsmedium", color:'white'}}>
                                D'ACCORD !  
                        </button>   
                    {/* </div> */}


                </div>

            </div>   
            <header className='absolute flex justify-end py-8 px-8'>

                {/* <Link to ="/cart" className='flex'>

                    <img id="panier" src="/images/panier2.png" alt="panier" className='h-16 w-auto'/>
                        <span className='relative rounded-full bg-red-500 text-white px-2.5 py-0 h-fit text-lg' 
                        style={{right:'15px', bottom:'5px',fontFamily:'poppinssemibold'}}>

                            {cartLength()}

                        </span>

                </Link> */}

                <img src="/images/question.png" alt="help" className='relative h-12 w-auto' onClick={help}/>
            </header>
        </>
    );
};

export default Header;