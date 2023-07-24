import React, { useEffect, useState, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, getCartInfo, removeFromCart } from "../actions/cartActions";
import { createOrder, detailsOrder } from "../actions/orderActions";
import HeaderCart from "../components/HeaderCart";
import {
  ORDER_CREATE_RESET,
  ORDER_DETAILS_RESET,
} from "../constants/orderConstants";
import Config from "../axios/Config";
import useAxiosInterceptors from "../axios/useAxios";
import Stripe from "../payments/Stripe/StripePayment";
import RestrictedProducts from "../components/AgeRestriction/RestrictedProducts";
import { CART_EMPTY } from "../constants/cartConstants";
import FooterNavbar from "../components/FooterNavbar";
import PageLoader from "../components/PageLoader";
import { cartInfoReducer } from "../reducers/cartReducers";
import CartLength from "../components/CartLength";

const CartScreen = () => {
  window.scrollTo(0, 0);
  localStorage.setItem("promoSolde", false);

  // const date = Time()

  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const navigate = useNavigate();
  const toPrice = (num) => parseFloat(num).toFixed(2);

  // const orderCreate = useSelector(state => state.orderCreate)
  const { order } = useSelector((state) => state.orderCreate.order) || {};

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  // cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
  // cart.promoprice = promoprice
  //const loading = false;

  const { loadingCart } = useSelector((state) => state.cart);
  const { success } = useSelector((state) => state.orderDetails);
  const orderDetails = useSelector((state) => state.orderDetails.order);
  const orderPay = useSelector((state) => state.orderPay);
  const dispatch = useDispatch();
  const [clientInfo, setClientInfo] = useState([]);
  const storeId = useSelector((state) => state.store.store.id);
  const { store } = useSelector((state) => state.store);

  const [checkedValues, setCheckedValues] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [localQty, setLocalQty] = useState([]);
  const [localTotal, setLocalTotal] = useState();
  const countItems = CartLength();

  
  useEffect(() => {
   
    if (order) {
      console.log("order dans cartScreen")
      console.log(cartItems)
      dispatch(getCartInfo(order._id, axiosInstance));
      axiosInstance.put("/track/cartscreen", { id: order._id });
    }
  }, []);

  useEffect(() => {
    let total = 0;
    cartItems.orderItems.map((item, index) => {
      total += item.price * (localQty[index] || item.Qty);
    });

    setLocalTotal(total);
  }, [localQty, cart]);

  const addItem = (product, index) => {
    console.log(index);

    let newLocalQty = [...localQty];
    newLocalQty[index] = (newLocalQty[index] || product.Qty) + 1;

    setLocalQty(newLocalQty);
    console.log(localQty);

    product.qty = newLocalQty[index];

    /*dispatch(addToCart(order._id, product, 1, axiosInstance));
    dispatch(getCartInfo(order._id, axiosInstance));
    axiosInstance.put("/track/cartscreen", { id: order._id });*/
    dispatch(addToCart(order._id, product, 1, axiosInstance)).then(() => {
      dispatch(getCartInfo(order._id, axiosInstance));
      axiosInstance.put("/track/cartscreen", { id: order._id });
    });

    // addToCart(order._id, product, 1, axiosInstance)
  };

  const deleteItem = (item, index) => {
    let newLocalQty = [...localQty];
    newLocalQty[index] = (newLocalQty[index] || item.Qty) - 1;

    setLocalQty(newLocalQty);
    console.log(localQty);

    removeFromCartHandler([{ product: item, qty: 1 }]);
  };

  const addToCartHandler = (product) => {
    //loadingCart = true;
    dispatch(addToCart(order._id, product, 1, axiosInstance))
    // .then(() => {
    //   dispatch(getCartInfo(order._id, axiosInstance));
    //   axiosInstance.put("/track/cartscreen", { id: order._id });
    // });
  };

  async function removeFromCartHandler(product_qty) {
    const cbarre_qty = product_qty.map(({ product, qty }) => ({
      Code_Barre: product.Code_Barre,
      qty: qty,
    }));

    dispatch(
      removeFromCart(cbarre_qty, order._id, product_qty, axiosInstance)
    )
    // .then(() => {
    //   dispatch(getCartInfo(order._id, axiosInstance));
    //   axiosInstance.put("/track/cartscreen", { id: order._id });
    // });

    setCheckedValues([]);
    setSelectAll(false);
  }

  const truncate = (str, n) => {
    console.log(str);
    return str.length > n ? str.slice(0, n - 3) + "..." : str;
  };

  const deletePopup = () => {
    let element = document.getElementById("deletePopup");
    if (element.style.visibility === "hidden") {
      element.style.visibility = "visible";
    } else {
      element.style.visibility = "hidden";
    }
  };

  useEffect(() => {
    if (cartItems) {
      // if (!cartItems || orderDetails.orderItems.length !== cartItems.length) {
      //   cart.cartItems = orderDetails.orderItems;
      // }
      // orderDetails.isPaid ? navigate(`/ordersuccess/${orderDetails._id}`) : <></>
      console.log("cartScreen cartIems is paid ? :"+ cartItems.isPaid)
      cartItems.isPaid ? navigate(`/ScanCheck`) : <></>;
    }
  }, [orderPay]);

  const handleCheckboxChange = (item) => {
    const isChecked = checkedValues.some((val) => val.product === item);

    if (isChecked) {
      // Uncheck the checkbox and remove the value from state
      setCheckedValues(checkedValues.filter((val) => val.product !== item));
    } else {
      // Check the checkbox and add the value to state
      const newCheckedValue = { product: item, qty: item.Qty };
      setCheckedValues([...checkedValues, newCheckedValue]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // Uncheck select all and remove all values from state
      setSelectAll(false);
      setCheckedValues([]);
    } else {
      // Check select all and add all items to state
      setSelectAll(true);
      const updatedCheckedValues = cartItems.orderItems.map((item) => ({
        product: item,
        qty: item.Qty,
      }));
      setCheckedValues(updatedCheckedValues);
    }
  };

  //console.log("----loadingCart " + loadingCart);

  return (
    <>
      {!cartItems ? (
        <PageLoader />
      ) : (
        <>
          {order === undefined ? (
            <>{navigate("/")}</>
          ) : (
            <div className="h-full overflow-auto cartscreen">
              <HeaderCart />

              {cartItems.orderItems.length === 0 ? (
                <>
                  <div className="w-full h-full flex flex-col p-16 items-center gap-5">
                    {/* <img
                      className="w-40 h-auto "
                      src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2Fcart_empty.png?alt=media&token=89a08347-edfa-4994-b01b-c45b65836427"
                      alt="empty_cart"
                    /> */}
                    <h1>Panier vide</h1>
                    <Link
                      className="cart_empty text-2xl text-center px-12 "
                      to="/scan"
                    >
                      Scannez ce que vous désirez pour le remplir !
                    </Link>
                  </div>
                  <FooterNavbar props={{ cart: true }} />
                </>
              ) : (
                <>
                  {cart && cartItems.orderItems ? (
                    <>
                      {loadingCart ? (
                        <>
                          <div
                            className="absolute top-0 h-screen w-screen "
                            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                          >
                            <div className="absolute  left-2/4 top-[25%]  -translate-x-2/4 ">
                              <div class="lds-spinner white">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {console.log(cartItems.orderItems)}
                      <div id="cartOrder" className="min-h-fit px-12 pb-80">
                        <div className="flex justify-between items-center">
                          <h3 className="text-3xl">Produit</h3>

                          <div className="flex items-center">
                            {checkedValues.length > 0 ? (
                              <button
                                className="border-none "
                                onClick={deletePopup}
                              >
                                <img
                                  className=" h-8 w-auto"
                                  src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2Fcart_delete.png?alt=media&token=e416fc1a-35c3-44d7-868d-8cced82b717e"
                                  alt="delete"
                                />
                              </button>
                            ) : (
                              <></>
                            )}
                            <p className="ml-8 mr-2">Tout sélectionner :</p>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAllChange}
                            />
                          </div>
                        </div>
                        <ul>
                          {cartItems.orderItems.map((item, index) => {
                            return (
                              <li key={item.index}>
                                {console.log(item.name)}
                                <div
                                  className="cart_list py-8 flex justify-evenly items-center bg-white rounded-[10px] mb-12"
                                  style={{ borderColor: item.CountInStock }}
                                >
                                  <input
                                    type="checkbox"
                                    value={item.Code_Barre}
                                    checked={checkedValues.some(
                                      (val) => val.product === item
                                    )}
                                    onChange={() => handleCheckboxChange(item)}
                                  />
                                  <div className="flex items-center justify-center">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-20 h-auto"
                                    ></img>
                                  </div>

                                  <div className="font-semibold pr-4 py-4 ml-4">
                                    <div className="min-30 text-left ">
                                      <p className="mb-1 w-40">
                                        {console.log(item.name)}
                                        {/* {truncate(item.name, 26)} */}
                                      </p>
                                      <p className="text-black">
                                        <strong>
                                          {toPrice(item.price).replace(
                                            ".",
                                            ","
                                          )}
                                          €
                                        </strong>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                                    <button
                                      className="border-none pr-4 minusBtn relative"
                                      //onClick={() => deleteItem(item, index)}
                                      onClick={() =>
                                        removeFromCartHandler([
                                          { product: item, qty: 1 },
                                        ])
                                      }
                                    >
                                      -
                                    </button>
                                    {localQty[index]
                                      ? localQty[index]
                                      : item.Qty}

                                    {countItems >= store.item_limit ? (
                                      <></>
                                    ) : (
                                      <button
                                        className=" top-1 border-none pl-4 relative top-px relative plusBtn "
                                        //onClick={() => addItem(item, index)}
                                        onClick={() => addToCartHandler(item)}
                                      >
                                        +
                                      </button>
                                    )}
                                    {/* <button
                                      className=" top-1 border-none pl-4 relative top-px relative plusBtn "
                                      onClick={() => addItem(item, index)}
                                    >
                                      +
                                    </button> */}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <div
                          className="dashed-top text-white mt-20 pt-6 px-8"
                          disabled={cartItems.orderItems.length === 0}
                        >
                          <div className="text-black">
                            <div className="pt-4 flex justify-between items-center flex-nowrap">
                              <div className="text-xl">Total Panier:&nbsp;</div>

                              <div className="font-bold flex text-3xl">
                                {toPrice(cartItems.itemsPrice).replace(
                                  ".",
                                  ","
                                )}
                                {/*toPrice(localTotal).replace(".", ",")*/}€
                              </div>
                            </div>
                          </div>
                        </div>
                        {loadingCart ? <></>: 
                        <Stripe />
                      }
                      </div>
                      <div
                        id="deletePopup"
                        className="absolute min-w-full min-h-full left-0 top-0 h-full overflow-auto flex justify-center items-center"
                        style={{ visibility: "hidden" }}
                      >
                        <div
                          id=""
                          className=" bg-white w-3/4 flex flex-col gap-10 p-8 rounded-[12px]"
                          style={{
                            boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)",
                          }}
                        >
                          <div className="flex justify-center flex-col gap-10 items-center ">
                            <p className="text-2xl text-center font-bold mt-4">
                              Voulez-vous vraiment retirer cet article du panier
                              ?
                            </p>
                          </div>

                          <div className="flex items-center justify-around">
                            <button
                              className="text-2xl py-2 px-4 rounded-[5px] border-none bg-[#e5e5e5]"
                              onClick={deletePopup}
                            >
                              Annuler
                            </button>
                            <button
                              style={{
                                backgroundColor: "rgba(239, 68, 68, 0.8)",
                              }}
                              className="text-2xl py-2 border-none  px-4 rounded-[5px] text-white  "
                              onClick={() => {
                                removeFromCartHandler(checkedValues);
                                deletePopup();
                              }}
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                      <FooterNavbar props={{ cart: true }} />
                    </>
                  ) : (
                    <>
                      {/* <div
                        id="loader"
                        class="loader loader-default is-active"
                        data-text="Chargement des donnÃ©es"
                      ></div> */}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CartScreen;
