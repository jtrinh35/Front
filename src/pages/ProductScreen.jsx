import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { detailsProduct } from '../actions/productActions.jsx';
import FooterProduct from '../components/FooterProduct.jsx';
import HeaderProduct from '../components/HeaderProduct.jsx';
import Config from '../axios/Config.jsx';


const ProductScreen = () => {
    console.log("hey")
    const {order} = useSelector(state => state.orderCreate.order)
    const axiosInstance = Config()
    const {id} = useParams();
    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails);
    const {loading, product} = productDetails;
    
    useEffect(() => {
        dispatch(detailsProduct(order.storeId,id, axiosInstance));
    }, [dispatch, id]);

    return (
    
        <>

            {loading ? (

                <div className="loader loader-default is-active"></div>
            )  : (
                    <div className="productscreen">
                        <div className="productscreen1">
                            <HeaderProduct/>

                                <img id="imgproduct" src={product[0].image} alt={product[0].name}/>


                            <div className="productname">
                                <h1>{product[0].name}</h1>
                                <h1 id="price_product" style={{fontSize: "50px"}}>{product[0].price} €</h1>
                            </div>
                        </div>
                        <div className="productscreen2">
                            <div className="product">

                                <ul className="infoproduct">

                                    <li >
                                        <blockquote className="infoproduct_size_text">
                                            <img src="/images/description.png" alt="description"id="description_img" />
                                            Description</blockquote>
                                        <blockquote className="infoproduct_description">{product[0].description}
                                        </blockquote>
                                    </li>

                                </ul>   
                                                
                            </div>

                        </div>
                        <FooterProduct/> 
                    </div>                   
                )}

        </>


    );
};

export default ProductScreen;