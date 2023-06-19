import { ID_GET_FAIL, ID_GET_REQUEST, ID_GET_SUCCESS } from "../constants/idConstants";

export const idActions = (visitorId) => (dispatch, getState) =>{
    dispatch({type: ID_GET_REQUEST});
    try{
        const location = {id: (new URLSearchParams(window.location.search)).get('ok'), fp:  visitorId}
        // const location = {id: (new URLSearchParams(window.location.search)).get('ok'), fp:  "ODlXDXnNstTSJ1AnnhWa"}
        dispatch({type: ID_GET_SUCCESS, payload:location});
        localStorage.setItem('id', JSON.stringify(getState().id));
    }catch(err){
        dispatch({type: ID_GET_FAIL})
        console.log(err)
    }
    
}