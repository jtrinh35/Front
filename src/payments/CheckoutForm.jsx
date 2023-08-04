import React, { useEffect, useState, useRef } from "react";
import Config from "../axios/Config";
import useAxiosInterceptors from "../axios/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { payOrder } from "../actions/orderActions";
import { CART_EMPTY } from "../constants/cartConstants";
import { Toast } from "../components/Toast";
import HeaderOrder from "../components/HeaderOrder";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { cartReducer } from "../reducers/cartReducers";
import Rating from "../components/Rating";
import CreditCard from "./Stripe/CreditCard";
import ApplePay from "./Stripe/ApplePay";
import RestrictionPopup from "../components/AgeRestriction/RestrictionPopup";
import Edenred from "./Edenred/Edenred";

const CheckoutForm = () => {
  const toPrice = (num) => parseFloat(num).toFixed(2);
  const navigate = useNavigate();
  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { store } = useSelector((state) => state.store);
  const [paymentRequest, setpaymentRequest] = useState(null);
  const [loadingaxios, setLoadingAxios] = useState(false);
  const [email1, setEmail1] = useState("");
  const [validemail, setValidemail] = useState(false);
  // const [promotion, setPromotion] = useState(false)
  const [applepay, setApplepay] = useState(true);
  const [restricted, setRestricted] = useState(false);
  const [display, useDisplay] = useState(true);
  const cart = useSelector((state) => state.cart);
  const popupRef = useRef(null);
  const [paddingBottom, setPaddingBottom] = useState("20rem");

  let paymentIntent, email, promotion, pr;
  
  const [order, setOrder] = useState(null)

  useEffect(()=>{
    if(cart){
      console.log(cart)
      setOrder(cart.cartItems)
    }
  }, [cart])

  function getData1(val) {
    setEmail1(val.target.value);
  }
  function checkmail() {
    if (/\S+@\S+\.\S+/.test(email1)) {
      setValidemail(true);
    } else {
      setValidemail(false);
      Toast("error", "email invalide");
    }
  }

  // checkout_payment
  const popup = () => {
    if (applepay === true) {
      setApplepay(false);
    } else {
      setApplepay(true);
    }
  };

  //console.log(order.itemsPrice + "applepay")
  useEffect(() => {
    const cartOrder = document.getElementById("cartOrder");
    cartOrder.style.paddingBottom = paddingBottom;
  }, [paddingBottom]);

  
  useEffect(() => {
    calculatePadding();
  }, [applepay]);

  const calculatePadding = () => {
    console.log(popup);
    const hauteurPopup = popupRef.current
      ? popupRef.current.offsetHeight
      : "20rem";
    //const hauteurPopup = popup.offsetHeight;
    const paddingValue = !applepay ? hauteurPopup + 100 + "px" : "20rem";
    setPaddingBottom(paddingValue);
    console.log("hauteur popup= " + hauteurPopup);
  };

  useEffect(() => {
    console.log(cart.cartItems.ageRestriction);
    cart.cartItems.ageRestriction === "toCheck"
      ? setRestricted(true)
      : setRestricted(false);
  }, [cart.cartItems]);

  function payer() {
    return (
      <div className="buy_now">
        Payer {toPrice(order.itemsPrice).replace(".", ",")}€
      </div>
    );
  }

  const button_email = () => {
    Toast("error", "email invalide");
    // toast.error("email invalide")
  };

  const checkbox = () => {
    // var doc = document.getElementById('checkbox_mail').checked
    // if(doc){
    //     document.getElementById('input_mail').value = client.mail
    //     setEmail1(client.mail)
    // }
    // else{
    //     setEmail1("")
    //     document.getElementById('input_mail').value = ""
    // }
  };

  return (
    <>
      {applepay && order? (
        <>
          <div>
            <div className="flex flex-col mt-10">
                <>
                
                  <ApplePay order={order} axiosInstance={axiosInstance} />
                  <div
                    className="pikko-btn rounded-full mt-14 mb-12 py-4 justify-self-end pikko-btn w-full text-center text-3xl"
                    onClick={popup}
                  >
                    Payer
                  </div> 
                  
                  <Edenred/>
                </>
              {/* )} */}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* <HeaderOrder></HeaderOrder> */}
          <div id="form" className="pt-4">
            {/* <div className='pl-4'>
                        <img src="/images/back_order.png" alt="logo" id="back_order" onClick={popup} className='h-6 w-auto'/>
                    </div>
                     */}
            <div
              ref={popupRef}
              id="popup"
              className="fixed bottom-0 left-0 w-screen h-fit bg-white z-50 rounded-t-[16px] p-8 px-8"
            >
              <button onClick={popup} className="border-none pb-4">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fpopup_cross.png?alt=media&token=85ef2558-f156-4bb2-ae74-00d3493ada5c"
                  alt="close"
                  className="h-8"
                />
              </button>
              {/* {validemail ? ( */}

              <CreditCard order={order} axiosInstance={axiosInstance} />

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutForm;
