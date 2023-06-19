import { GET_STORE_REQUEST, GET_STORE_SUCCESS, GET_STORE_FAIL } from '../constants/storeConstants'

export const getStore = (id, axiosInstance) => async(dispatch, getState) => {
    dispatch({type: GET_STORE_REQUEST});
    try{
        const {data} = await axiosInstance.get(`/store/${id}`)
        dispatch({type: GET_STORE_SUCCESS, payload: data});
        localStorage.setItem('store', JSON.stringify(getState().store));
    }catch(err){
        dispatch({type: GET_STORE_FAIL})
        console.log(err)

    }
}
