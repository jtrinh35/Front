// import data from './data'
import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import {
  detailsProductReducer,
  productListReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderComReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderVerifReducer,
} from "./reducers/orderReducers";
import { idReducer } from "./reducers/idReducers";
import { storeReducer } from "./reducers/storeReducers";
import { payMethodReducer } from "./reducers/payMethodReducers";
import { addUserReducer } from "./reducers/userReducers";

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    //cartItems: localStorage.getItem('cartItems') === "undefined" ? [] : JSON.parse(localStorage.getItem('cartItems')),
  },
  orderCreate: localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : [],
  id: localStorage.getItem("id") ? JSON.parse(localStorage.getItem("id")) : {},
  productList: {
    products:
      localStorage.getItem("products") === "undefined"
        ? []
        : JSON.parse(localStorage.getItem("products")),
    // products: localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []
  },
  orderDetails: localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [],
  store: localStorage.getItem("store")
    ? JSON.parse(localStorage.getItem("store"))
    : {},

  payMethod: localStorage.getItem("payMethod")
    ? JSON.parse(localStorage.getItem("payMethod"))
    : {},

  user: localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {},
};
// const reducer = (state, action)=>{
//     // State Redux Browser: on voit la liste des produits car on le return ici
//     return{products: data.products}
// }
const reducer = combineReducers({
  orderDetails: orderDetailsReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderPay: orderPayReducer,
  productList: productListReducer,
  productDetails: detailsProductReducer,
  orderCom: orderComReducer,
  orderVerif: orderVerifReducer,
  id: idReducer,
  store: storeReducer,
  payMethod: payMethodReducer,
  user: addUserReducer,
});

const composeEnhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhance(applyMiddleware(thunk))
);

export default store;
