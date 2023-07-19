import {
  CART_ADD_ITEM,
  CART_ADD_ITEM_REQUEST,
  CART_EMPTY,
  CART_INFO_FAIL,
  CART_INFO_REQUEST,
  CART_INFO_SUCCESS,
  CART_REMOVE_ITEM_FAIL,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
} from "../constants/cartConstants";
import update from "react-addons-update";

export const cartReducer = (state = { cartItems: {} }, action) => {
  const toPrice = (num) => +parseFloat(num).toFixed(2);
  switch (action.type) {
    case CART_ADD_ITEM: //dans le cas où l'action est "add to cart"
      const res = action.payload; //prend les données collectées dans action
      const orderItems = state.cartItems.orderItems;
      console.log(state.cartItems.orderItems);
      //exist item et if(existItem) permettent de ne pas mettre deux fois le même article, décommenter pour active cette option
      const existItem = state.cartItems.orderItems.filter(
        (x) => x.Code_Barre === res.orderItems[0].Code_Barre
      );
      console.log("addd")
        console.log(action.payload)
      // console.log(item.Qty + existItem[0].Qty)
      if (existItem[0]) {
        console.log("exiiiistItemQty")
        console.log(existItem[0].Qty)
        console.log("resItemQty")
        console.log(res.orderItems[0].Qty)
        return {

            ...state,
            cartItems: action.payload,
            /*cartItems: {
              ...action.payload,
              orderItems: state.cartItems.orderItems.map((orderItem) => {
                if (orderItem.Code_Barre === existItem[0].Code_Barre) {
                  return {
                    ...orderItem,
                    Qty:  res.orderItems[0].Qty + existItem[0].Qty,
                  };
                }
                return orderItem;
              }),
            },*/
            
            // ...state,
            // cartItems : action.payload,
            
            
          /*...state,
          cartItems: {
            ...state.cartItems,
            orderItems: state.cartItems.orderItems.map(
              (
                x //ajouter les éléments de l'action dans la liste cartItems
              ) =>
                x.Code_Barre === existItem[0].Code_Barre
                  ? {
                      name: item.name,
                      image: item.image,
                      price: toPrice(item.price),
                      product: item._id,
                      Code_Barre: item.Code_Barre,
                      Qty: item.Qty + existItem[0].Qty,
                    }
                  : x
            ),
          },*/
        };
      } else {
        return {
          ...state,
          cartItems : res
          /*cartItems: {
            ...state.cartItems,
            orderItems: [...state.cartItems.orderItems, res.orderItems[0]],
          },*/
        };
      }

    case CART_ADD_ITEM_REQUEST:
      return {
        loading: false,
        loadingCart: true,
        cartItems: { ...state.cartItems },
      };

    case CART_REMOVE_ITEM_REQUEST:
      return {
        loading: false,
        loadingCart: true,
        cartItems: { ...state.cartItems },
      };

    case CART_REMOVE_ITEM_SUCCESS:
      const product = state.cartItems.orderItems.filter(
        (x) => x.Code_Barre === action.payload[0].Code_Barre
      )[0];
      if (product.Qty - action.payload[0].qty >= 1) {
        console.log("here");
        product.Qty = product.Qty - action.payload[0].qty;
        return {
          loading: false,
          ...state,
          cartItems: {
            ...state.cartItems,
            orderItems: state.cartItems.orderItems.map(
              (
                x //ajouter les éléments de l'action dans la liste cartItems
              ) =>
                x.Code_Barre === product.Code_Barre
                  ? {
                      name: product.name,
                      image: product.image,
                      price: toPrice(product.price),
                      product: product._id,
                      Code_Barre: product.Code_Barre,
                      Qty: product.Qty,
                    }
                  : x
            ),
          },
        };
      } else {
        console.log("here here");
        return {
          loading: false,
          ...state,
          cartItems: {
            ...state.cartItems,
            orderItems: state.cartItems.orderItems.filter(
              (x) => x.Code_Barre !== product.Code_Barre
            ),
          },
        };
      }
    //on filtre la liste de carteItems et on garde tous ceux qui ne sont pas égaux à la remove

    case CART_REMOVE_ITEM_FAIL:
      return { loading: false, cartItems: { ...state.cartItems } };

    case CART_EMPTY:
      return { ...state, cartItems: [] };

    case CART_INFO_REQUEST:
      return { ...state, cartItems: state.cartItems };

    case CART_INFO_SUCCESS:
      return { loading: false, loadingCart: false, cartItems: action.payload };

    case CART_INFO_FAIL:
      return { loading: false, loadingCart: false, cartItems: state.cartItems };

    default:
      return state;
  }
};
