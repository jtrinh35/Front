import { GET_STORE_FAIL, GET_STORE_REQUEST, GET_STORE_SUCCESS, STORE_RESET } from "../constants/storeConstants";

export const storeReducer = (state = {}, action) =>{
    switch(action.type){

        case GET_STORE_REQUEST:
            return {loading: true};
        case GET_STORE_SUCCESS:
            return{loading: false, success: true, store: action.payload};
        case GET_STORE_FAIL:
            return{loading: false, success: false};
        case STORE_RESET:
            return {}
        default: 
            return state
    }
}