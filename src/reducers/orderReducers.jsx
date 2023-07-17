import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_RESET, ORDER_CREATE_SUCCESS,ORDER_DETAILS_REQUEST,ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_RESET, ORDER_COM_REQUEST, ORDER_COM_SUCCESS, ORDER_COM_FAIL, ORDER_DETAILS_RESET, ORDER_VERIF_REQUEST, ORDER_VERIF_SUCCESS, ORDER_VERIF_FAIL } from "../constants/orderConstants";

export const orderCreateReducer = (state = {cartItems : {}}, action) =>{
    switch(action.type){
        case ORDER_CREATE_REQUEST:
            return {loading: true};
        case ORDER_CREATE_SUCCESS:
            return{loading: false, success: true, order: action.payload};
        case ORDER_CREATE_FAIL:
            return{loading: false, error: action.payload};
        case ORDER_CREATE_RESET:
            return {};
        default: 
            return state;
    }
}

export const orderDetailsReducer = (state = {loading: true}, action) =>{
    console.log(state.cartItems)
    switch (action.type){
        case ORDER_DETAILS_REQUEST:
            return{loading: true};
        case ORDER_DETAILS_SUCCESS:
            console.log(action.payload.orderItems)
            return{loading: false, order: action.payload, success: true};
        case ORDER_DETAILS_FAIL:
            return{loading: false, error: action.payload};
        case ORDER_DETAILS_RESET:
            return {};
        default: 
            return state;
    }
}

export const orderPayReducer = (state = {}, action) => {
    switch(action.type){
        case ORDER_PAY_REQUEST:
            return{loading: true}
        case ORDER_PAY_SUCCESS:
            console.log(state)
            console.log(action)
            return{loading: false, success: true}
        case ORDER_PAY_FAIL:
            return{loading: false, error: action.payload}
        case ORDER_PAY_RESET:
            return{};
        default: 
            return state;
    }
};

export const orderComReducer = (state = {}, action) => {
    switch(action.type){
        case ORDER_COM_REQUEST:
            return{loading: true};
        case ORDER_COM_SUCCESS:
            return{loading: false, success: true};
        case ORDER_COM_FAIL:
            return{loading: false, error: action.payload};
        default:
            return state
    }
}

export const orderVerifReducer = (state = {}, action) => {
    switch(action.type){
        case ORDER_VERIF_REQUEST:
            return{loading: true};
        case ORDER_VERIF_SUCCESS:
            return{loading: false, success: true};
        case ORDER_VERIF_FAIL:
            return{loading: false, error: action.payload};
        default:
            return state
    }
}