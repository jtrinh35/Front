import { Product_details_fail, Product_details_req, Product_details_success, Product_list_fail, Product_list_req, Product_list_success } from "../constants/productConstants"


export const listProducts = (data) => async(dispatch, getState) => {
    
    dispatch({
        type: Product_list_req
    })
    try{
        // const {data} = await axiosInstance.get('/products')
        dispatch({type: Product_list_success, payload: data})
    }catch(err){
        dispatch({type: Product_list_fail, payload: err.message})
        console.log(err)
    }
    localStorage.setItem('products', JSON.stringify(getState().productList.products));
}

export const detailsProduct = (storeId, codeBarre, axiosInstance) => async (dispatch) => {
    dispatch({type:Product_details_req, payload: codeBarre})
    try{
        const {data} = await axiosInstance.get(`/products/${storeId}/${codeBarre}`)
        dispatch({type: Product_details_success, payload: data})
    }catch(err){
        dispatch({type: Product_details_fail, payload: err.response && err.response.data.message 
        ? err.response.data.message
        : err.message})
    }
}