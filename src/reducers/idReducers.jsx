import { ID_GET_SUCCESS, ID_GET_FAIL, ID_GET_REQUEST, ID_RESET} from "../constants/idConstants";

export const idReducer = (state = {}, action) =>{
    // console.log(action.payload)
    switch(action.type){
        case ID_GET_REQUEST:
            return {};
        case ID_GET_SUCCESS:
            return {id: action.payload, success : true};
        case ID_GET_FAIL:
            return {};
        case ID_RESET:
            return {};
        default: 
            return state;
    }
}