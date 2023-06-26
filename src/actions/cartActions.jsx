import { CART_ADD_ITEM, CART_REMOVE_ITEM_FAIL, CART_REMOVE_ITEM_REQUEST, CART_REMOVE_ITEM_SUCCESS } from '../constants/cartConstants'

export const addToCart = (orderId, product, qty, axiosInstance) => async(dispatch, getState) => {
    
    const toPrice = (num) => (+parseFloat(num).toFixed(2))
    const toAddProduct = {
        name: product.name,
            image: product.image,
            price: toPrice(product.price),
            product: product._id,
            CountInStock: product.CountInStock, //CountInStock
            Code_Barre: product.Code_Barre,
            category: product.category,
            formule: product.formule,
            Qty: qty,
        }

    await axiosInstance.put(`orders/${orderId}/add`, toAddProduct);

    dispatch({
        type: CART_ADD_ITEM,
        payload: toAddProduct
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

/*export const removeFromCart = (Code_Barre, orderId, product, axiosInstance, qty) => async(dispatch, getState) =>{
    dispatch({type: CART_REMOVE_ITEM_REQUEST})
    try{
        await axiosInstance.put(`orders/${orderId}/delete`, {product, qty})
        dispatch({type: CART_REMOVE_ITEM_SUCCESS, payload: {Code_Barre, qty}})
    }catch(err){
        console.log(err)
        // console.log("product not found in order " + orderId)
        dispatch({type: CART_REMOVE_ITEM_FAIL})
    }
    
    // dispatch({type: CART_REMOVE_ITEM, payload:index});
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}*/


export const removeFromCart = (Code_Barres_Qty, orderId, Products_Qty, axiosInstance) => async(dispatch, getState) =>{
    dispatch({type: CART_REMOVE_ITEM_REQUEST})
    try{
        await axiosInstance.put(`orders/${orderId}/delete`, Products_Qty)
        dispatch({type: CART_REMOVE_ITEM_SUCCESS, payload: Code_Barres_Qty})
    }catch(err){
        console.log(err)
        // console.log("product not found in order " + orderId)
        dispatch({type: CART_REMOVE_ITEM_FAIL})
    }
    
    // dispatch({type: CART_REMOVE_ITEM, payload:index});
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}