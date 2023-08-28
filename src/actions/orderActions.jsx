import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_COM_REQUEST,
  ORDER_COM_SUCCESS,
  ORDER_COM_FAIL,
  ORDER_VERIF_REQUEST,
  ORDER_VERIF_SUCCESS,
  ORDER_VERIF_FAIL,
} from "../constants/orderConstants";

export const createOrder =
  (order, axiosInstance) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
      console.log("call create order");
      //console.log(order)
      const { data } = await axiosInstance.post("/orders", order, {
        promoPrice: order.promoprice,
      });
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
      localStorage.setItem("order", JSON.stringify(getState().orderCreate));
    } catch (error) {
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      console.log(order);
    }
  };

export const detailsOrder =
  (orderId, axiosInstance) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    try {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
    localStorage.setItem(
      "orderDetails",
      JSON.stringify(getState().orderDetails)
    );
  };

export const payOrder =
  (order, email, paymentIntent, axiosInstance) =>
  async (dispatch) => {
    // const amount = order_amount;
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, email } });
    try {
      const { data } = await axiosInstance.put(`/orders/${order._id}/pay`, {
        order,
        email: email,
        status: paymentIntent.status,
        // amount: amount,
      });

      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
  };

export const comOrder = (orderId, com, axiosInstance) => async (dispatch) => {
  dispatch({ type: ORDER_COM_REQUEST, payload: { orderId, com } });
  try {
    const { data } = await axiosInstance.put(`/orders/${orderId}/commentaire`, {
      commentaire: com,
    });
    localStorage.setItem("rating", true);
    dispatch({ type: ORDER_COM_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_COM_FAIL, payload: message });
  }
};
export const verifOrder = (orderId, axiosInstance) => async (dispatch) => {
  dispatch({ type: ORDER_VERIF_REQUEST, payload: { orderId } });
  try {
    const { data } = await axiosInstance.put(`/orders/${orderId}/verif`);
    dispatch({ type: ORDER_VERIF_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_VERIF_FAIL, payload: message });
  }
};

