import 
{ 
    GET_PM_FAIL,
    GET_PM_REQUEST,
    GET_PM_SUCCESS,
    PAY_SELECT_METHOD_CB_FAIL,
    PAY_SELECT_METHOD_CB_REQUEST,
    PAY_SELECT_METHOD_CB_SUCCESS,
    PAY_SELECT_METHOD_TR_FAIL, 
    PAY_SELECT_METHOD_TR_REQUEST, 
    PAY_SELECT_METHOD_TR_SUCCESS,
}
from "../constants/payMethodConstants";


export const payMethodReducer = (state = {}, action) => {
    switch (action.type) {

      case PAY_SELECT_METHOD_TR_REQUEST:
        return { ...state };
      case PAY_SELECT_METHOD_TR_SUCCESS:
        console.log(action.payload)
        const paymentTR = action.payload.paymentTR;
        return { card: {...state.card} , ...state, TR: paymentTR };
      case PAY_SELECT_METHOD_TR_FAIL:
        return { ...state };

      case PAY_SELECT_METHOD_CB_REQUEST:
        return { ...state };
      case PAY_SELECT_METHOD_CB_SUCCESS:
        let result
        const paymentCB = action.payload.paymentCB;
        paymentCB === 'applepay' ? result = 'applepay' : result = "cb " + paymentCB
        return { card: {...state.card}, ...state, CB: result } 
      case PAY_SELECT_METHOD_CB_FAIL:
        return { ...state };

      case GET_PM_REQUEST:
        return {...state}
      case GET_PM_SUCCESS: 
        console.log(action.payload.data)
        return {...state, CB: "cb " + action.payload.data.brand, card: action.payload.data}
      case GET_PM_FAIL:
        return {...state}

      default:
        return state;
    }
  };


  