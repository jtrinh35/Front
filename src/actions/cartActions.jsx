import {
  CART_ADD_ITEM,
  CART_ADD_ITEM_REQUEST,
  CART_INFO_FAIL,
  CART_INFO_REQUEST,
  CART_INFO_SUCCESS,
  CART_REMOVE_ITEM_FAIL,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
} from "../constants/cartConstants";

export const addToCart =
  (orderId, product, qty, axiosInstance) => async (dispatch, getState) => {
    dispatch({ type: CART_ADD_ITEM_REQUEST });
    try {
      const toPrice = (num) => +parseFloat(num).toFixed(2);
      const toAddProduct = {
        name: product.name,
        image: product.image,
        price: toPrice(product.price),
        product: product._id,
        CountInStock: product.CountInStock, //CountInStock
        Code_Barre: product.Code_Barre,
        category: product.category,
        formule: product.formule,
        TR: product.TR,
        Qty: qty,
      };

      const res = await axiosInstance.put(
        `orders/${orderId}/add`,
        toAddProduct
      );

      dispatch({
        type: CART_ADD_ITEM,
        payload: res.data,
      });
      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
      );
    } catch (err) {
      console.log(err);
    }
  };

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

export const removeFromCart =
  (Code_Barres_Qty, orderId, Products_Qty, axiosInstance) =>
  async (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM_REQUEST });
    try {
      const res = await axiosInstance.put(
        `orders/${orderId}/delete`,
        Products_Qty
      );
      // dispatch({ type: CART_REMOVE_ITEM_SUCCESS, payload: Code_Barres_Qty });
      dispatch({ type: CART_REMOVE_ITEM_SUCCESS, payload: res.data });
    } catch (err) {
      console.log(err);
      // console.log("product not found in order " + orderId)
      dispatch({ type: CART_REMOVE_ITEM_FAIL });
    }

    // dispatch({type: CART_REMOVE_ITEM, payload:index});
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const getCartInfo =
  (orderId, axiosInstance) => async (dispatch, getState) => {
    dispatch({ type: CART_INFO_REQUEST, payload: orderId });
    try {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      dispatch({ type: CART_INFO_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: CART_INFO_FAIL, payload: message });
    }
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };
