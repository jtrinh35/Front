import { ADD_USER_FAIL, ADD_USER_ID_FAIL, ADD_USER_ID_REQUEST, ADD_USER_ID_SUCCESS, ADD_USER_REQUEST, ADD_USER_SUCCESS } from "../constants/userConstants";


export const addUserReducer = (state = {}, action) => {
    switch (action.type) {
      case ADD_USER_REQUEST:
        return { ...state };
      case ADD_USER_SUCCESS:
        return { ...state, name: action.payload.name, email: action.payload.email};
      case ADD_USER_FAIL:
        return { ...state };

      case ADD_USER_ID_REQUEST:
        return { ...state };
      case ADD_USER_ID_SUCCESS:
        return {...state, id: action.payload.id};
      case ADD_USER_ID_FAIL:
        return { ...state };

      default:
        return state;
    }
  };

  