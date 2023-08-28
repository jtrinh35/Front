import { ADD_USER_FAIL, ADD_USER_ID_FAIL, ADD_USER_ID_REQUEST, ADD_USER_ID_SUCCESS, ADD_USER_REQUEST, ADD_USER_SUCCESS } from "../constants/userConstants";

export const addUser = (name, email) => async (dispatch, getState) => {
    dispatch({ type: ADD_USER_REQUEST });
    try {
      dispatch({
        type: ADD_USER_SUCCESS,
        payload: { name, email},
      });

      localStorage.setItem("user", JSON.stringify(getState().user));
    } catch (error) {
      console.log(error);
      dispatch({ type: ADD_USER_FAIL });
    }
  };

  export const addUserId = (id) => async (dispatch, getState) => {
    console.log(id)
    dispatch({ type: ADD_USER_ID_REQUEST });
    try {
      dispatch({
        type: ADD_USER_ID_SUCCESS,
        payload: {id},
      });
      localStorage.setItem("user", JSON.stringify(getState().user));

    } catch (error) {
      console.log(error);
      dispatch({ type: ADD_USER_ID_FAIL });
    }
  };