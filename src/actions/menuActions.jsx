import { Menu_list_fail, Menu_list_req, Menu_list_success } from "../constants/menuConstants"

export const listMenus = (axiosInstance) => async(dispatch, getState) =>{
    console.log("menu")
    dispatch({type: Menu_list_req})
    try{
        const {data} = await axiosInstance.get('/products/menu')
        dispatch({type: Menu_list_success, payload: data})
    }catch(err){
        dispatch({type: Menu_list_fail, payload: err.message})
        console.log(err)
    }
    localStorage.setItem('menu', JSON.stringify(getState().menu));
}