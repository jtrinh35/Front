import { Product_details_fail, Product_details_req, Product_details_success, Product_list_fail, Product_list_req, Product_list_success } from "../constants/productConstants";

export const productListReducer = (state= {loading: true, products: [] }, action) => {
    switch(action.type){
        case Product_list_req:
            return{loading: true};
        case Product_list_success:
            return{loading: false, products: action.payload};
        case Product_list_fail:
            return{loading: false, err: action.payload};
        default: 
            return(state)
    }
}

export const detailsProductReducer = (state = { product: {}, loading: true}, action) => {
    switch(action.type){
        case Product_details_req:
            return {loading: true};
        case Product_details_success:
            return{loading: false, product: action.payload };
        case Product_details_fail:
            return {loading: false, err: action.payload};
        default: 
            return state;
    }
}