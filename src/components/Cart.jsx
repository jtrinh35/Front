// import React from 'react';
// import { useNavigate } from 'react-router';
// import { addToCart } from '../actions/cartActions';
// import { useDispatch } from 'react-redux';
// import { axiosInstance } from '../axiosInstance';


// const Cart = (props) => {

//     const dispatch = useDispatch();
//     const {product} = props;
//     let navigate = useNavigate();
    
//     function addToCartHandler() {
//         if(product._id){
//             dispatch(addToCart(product._id, axiosInstance));
//             navigate('/scan')
//         }
//     }


//         return (
//         <div className="footerproduct">
//             <div className="card">
//                 {
//                     product.CountInStock > 0 && (
//                         <div className="addtocart">
//                             <button onClick={addToCartHandler} className="addtocart_button" >
//                                 <div className="shoppingcart">
//                                     <img src="/images/panier3.svg" alt="shopping cart" id="shoppingcart"/>
//                                 </div>
//                                 <div >
//                                     <p className="addtocart_text"> Ajouter </p>                                              
//                                 </div>
//                             </button>
//                         </div>
//                     )

//                     }
//             </div>
//         </div>
//     )
// };

// export default Cart;