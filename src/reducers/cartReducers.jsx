import { CART_ADD_ITEM, CART_EMPTY, CART_REMOVE_ITEM_FAIL, CART_REMOVE_ITEM_REQUEST, CART_REMOVE_ITEM_SUCCESS } from "../constants/cartConstants";

export const cartReducer=(state = {cartItems : {}}, action)=>{

    switch (action.type){
        case CART_ADD_ITEM: //dans le cas où l'action est "add to cart"
            const item = action.payload; //prend les données collectées dans action
            //exist item et if(existItem) permettent de ne pas mettre deux fois le même article, décommenter pour active cette option
            const existItem = state.cartItems.filter(x => x.Code_Barre === item.Code_Barre)
            const toPrice = (num) => (+parseFloat(num).toFixed(2))
            // console.log(item.Qty + existItem[0].Qty)

            if(existItem[0]){
                return{
                    ...state, //permet de ne pas modifier l'état existant
                    cartItems: state.cartItems.map((x)=> //ajouter les éléments de l'action dans la liste cartItems
                        x.Code_Barre === existItem[0].Code_Barre ? 
                        {
                            name: item.name,
                            image: item.image,
                            price: toPrice(item.price),
                            product: item._id,
                            Code_Barre: item.Code_Barre,
                            Qty: item.Qty + existItem[0].Qty,
                        } : 
                        x),
                        //remplace l'item par le nouveau même item
                };
            }else{
                return{
                    ...state, cartItems:[...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM_REQUEST:
            return{loading: false, cartItems: state.cartItems}

        case CART_REMOVE_ITEM_SUCCESS: 

            const product = state.cartItems.filter(x => x.Code_Barre === action.payload.Code_Barre)[0]
            if(product.Qty - action.payload.qty >= 1) {
                product.Qty = product.Qty - action.payload.qty
                return{loading: false, ...state, cartItems: [...state.cartItems.filter(x => x.Code_Barre !== action.payload.Code_Barre), product]}
            }
            else {
                return{loading: false, cartItems: state.cartItems.filter(x => x.Code_Barre !== action.payload.Code_Barre)}
            }
            //on filtre la liste de carteItems et on garde tous ceux qui ne sont pas égaux à la remove

        case CART_REMOVE_ITEM_FAIL:
            return{loading: false, cartItems: state.cartItems.filter(x => x.index !== action.payload)}

        case CART_EMPTY:
            return{...state, cartItems : []};

        default:
            return state;
    }
}

