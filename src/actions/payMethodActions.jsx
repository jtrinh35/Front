import axios from "axios";
import {
  GET_PM_FAIL,
  GET_PM_REQUEST,
    GET_PM_SUCCESS,
    PAY_SELECT_METHOD_CB_FAIL,
    PAY_SELECT_METHOD_CB_REQUEST,
    PAY_SELECT_METHOD_CB_SUCCESS,
    PAY_SELECT_METHOD_TR_FAIL,
    PAY_SELECT_METHOD_TR_REQUEST,
    PAY_SELECT_METHOD_TR_SUCCESS, 
} from "../constants/payMethodConstants";

export const selectPaymentTR = (paymentTR) => async (dispatch, getState) => {
    dispatch({ type: PAY_SELECT_METHOD_TR_REQUEST });
    try {

      dispatch({
        type: PAY_SELECT_METHOD_TR_SUCCESS,
        payload: { paymentTR},
      });

      localStorage.setItem("payMethod", JSON.stringify(getState().payMethod));
    } catch (error) {
      console.log(error);
      dispatch({ type: PAY_SELECT_METHOD_TR_FAIL });
    }
  };

  export const selectPaymentCB = (paymentCB) => async (dispatch, getState) => {
    dispatch({ type: PAY_SELECT_METHOD_CB_REQUEST });
    try {

      dispatch({
        type: PAY_SELECT_METHOD_CB_SUCCESS,
        payload: { paymentCB},
      });

      localStorage.setItem("payMethod", JSON.stringify(getState().payMethod));
    } catch (error) {
      console.log(error);
      dispatch({ type: PAY_SELECT_METHOD_CB_FAIL });
    }
  };

export const getPM = (customerId, axiosInstance) => async(dispatch, getState) => {
  dispatch({type: GET_PM_REQUEST})
  try{

    const {data} = await axiosInstance.post('/stripe/customer', {
      customerId: customerId
    })
    console.log(data)
    dispatch({
      type: GET_PM_SUCCESS,
      payload: { data },
    });
    localStorage.setItem("payMethod", JSON.stringify(getState().payMethod));

  } catch(error){
    console.log(error)
    dispatch({type: GET_PM_FAIL})
  }
}