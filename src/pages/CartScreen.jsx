import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
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

const CartScreen = () => {
  window.scrollTo(0, 0);
  localStorage.setItem("promoSolde", false);

  // const date = Time()

  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const navigate = useNavigate();
  const toPrice = (num) => parseFloat(num).toFixed(2);

  const [promotion, setPromotion] = useState();
  const [promoprice, setPromoprice] = useState(0);
  const [promoPizz, setPromoPizz] = useState(false);
  const [pricePizz, setPricePizz] = useState(0);
  const [promoBoisson, setPromoBoisson] = useState(false);
  // const orderCreate = useSelector(state => state.orderCreate)
  const { order } = useSelector((state) => state.orderCreate.order) || {};

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  // cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
  // cart.promoprice = promoprice

  const { success, loading } = useSelector((state) => state.orderDetails);
  const orderDetails = useSelector((state) => state.orderDetails.order);
  const orderPay = useSelector((state) => state.orderPay);
  const dispatch = useDispatch();
  const [clientInfo, setClientInfo] = useState([]);
  const storeId = useSelector((state) => state.store.store.id);
  const { store } = useSelector((state) => state.store);

  const [checkedValues, setCheckedValues] = useState([]);

  useEffect(() => {
    if (order) {
      axiosInstance.put("/track/cartscreen", { id: order._id });
    }
  }, []);

  const addToCartHandler = (product) => {
    dispatch(addToCart(order._id, product, 1, axiosInstance));
  };

  async function removeFromCartHandler(product_qty) {
    const cbarre_qty = product_qty.map(({ product, qty }) => ({
      Code_Barre: product.Code_Barre,
      qty: qty,
    }));

    console.log("---product_qty---");
    console.log(product_qty);
    const data = await dispatch(
      removeFromCart(cbarre_qty, order._id, product_qty, axiosInstance)
    );
    setCheckedValues([]);
  }

  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 3) + "..." : str;
  };

  const applyPromotion = () => {
    setPromotion(true);
  };

  useEffect(() => {
    if (orderDetails) {
      if (!cartItems || orderDetails.orderItems.length !== cartItems.length) {
        cart.cartItems = orderDetails.orderItems;
      }
      // orderDetails.isPaid ? navigate(`/ordersuccess/${orderDetails._id}`) : <></>
      orderDetails.isPaid ? navigate(`/ScanCheck`) : <></>;
    }
  }, [orderPay]);

  useEffect(() => {
    if (order) {
      dispatch(detailsOrder(order._id, axiosInstance));
    }
  }, [cart, orderPay]);

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

  // useEffect (()=>{
  //     if(promotion)
  //     {
  //         // cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
  //         // toPrice(cartItems.reduce((a,c) => a+c.price, 0)) - soldeClient < 1 ?
  //         // setPromoprice(1)
  //         // : setPromoprice(toPrice(toPrice(cartItems.reduce((a,c) => a+c.price, 0)) - soldeClient))
  //         // cart.soldePrice = true
  //     }
  //     else{
  //         cart.itemsPrice = toPrice(cartItems.reduce((a,c) => a+c.price, 0))
  //         cart.soldePrice = false
  //         setPromoprice(0)
  //     }
  // },[promotion, cartItems.length, cart, promoprice, promoPizz, clientInfo, pricePizz])

  return (
    <>
      {loading || !orderDetails ? (
        <div className="loader loader-default is-active"></div>
      ) : (
        <>
          {order === undefined ? (
            <>{navigate("/")}</>
          ) : (
            <div className="h-full overflow-auto cartscreen">
              <HeaderCart />

              {orderDetails.orderItems.length === 0 ? (
                <>
                  <div className="w-full h-full flex flex-col p-16 items-center gap-5">
                    <img
                      className="w-40 h-auto "
                      src="/images/logo_order.png"
                      alt="empty_cart"
                    />
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
                  {orderDetails ? (
                    <>
                      <div className="min-h-fit px-12 pb-64">
                        <div className="flex justify-between">
                          <h3 className="text-3xl">Product</h3>
                          {checkedValues.length > 0 ? (
                            <button
                              className="border-none"
                              onClick={() =>
                                removeFromCartHandler(checkedValues)
                              }
                            >
                              <img
                                className=" h-8 w-auto"
                                src="/images/delete.png"
                                alt="delete"
                              />
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>
                        <ul>
                          {orderDetails.orderItems.map((item) => (
                            <li key={item.index}>
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
                                      {truncate(item.name, 26)}
                                    </p>
                                    <p className="text-black">
                                      <strong>
                                        {toPrice(item.price).replace(".", ",")}€
                                      </strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                                  <button
                                    className="border-none pr-4 minusBtn relative"
                                    onClick={() =>
                                      removeFromCartHandler([
                                        { product: item, qty: 1 },
                                      ])
                                    }
                                  >
                                    -
                                  </button>
                                  {item.Qty}
                                  <button
                                    className=" top-1 border-none pl-4 relative top-px relative plusBtn "
                                    onClick={() => addToCartHandler(item)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div
                          className="dashed-top text-white mt-20 pt-6 px-8"
                          disabled={orderDetails.orderItems.length === 0}
                        >
                          <div className="text-black">
                            <div className="pt-4 flex justify-between items-center flex-nowrap">
                              <div className="text-xl">Bag Total:&nbsp;</div>

                              <div className="font-bold flex text-3xl">
                                {toPrice(orderDetails.itemsPrice).replace(
                                  ".",
                                  ","
                                )}
                                €
                              </div>
                            </div>
                          </div>
                        </div>
                        <Stripe />
                      </div>
                      <FooterNavbar props={{ cart: true }} />
                    </>
                  ) : (
                    <>
                      <div
                        id="loader"
                        class="loader loader-default is-active"
                        data-text="Chargement des données"
                      ></div>
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
