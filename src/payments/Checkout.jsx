import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPaymentTR } from "../actions/payMethodActions";
import useAxiosInterceptors from "../axios/useAxios";
import PopupPayment from "./PopupPayment";
import ApplePay from "./Stripe/ApplePay";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Edenred from "./Edenred/Edenred";
import { Toast } from "../components/Toast";
import { payOrder } from "../actions/orderActions";
import axios from "axios";
import {EdenredCancel, EdenredCapture, EdenredConfirm} from "./Edenred/EdenredPayment.js";
import useEdenredInterceptors from "../axios/edenredAxios/useEdenredAxios";
import Statement from "./Statement";


const Checkout = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptors();
  const edenredInstance = useEdenredInterceptors()
  const cart = useSelector((state) => state.cart);
  const [order, setOrder] = useState(null);
  const payMethod = useSelector((state) => state.payMethod);
  const user = useSelector((state) => state.user);
  const [edenredBalance, setEdenredBalance] = useState();
  const [trToggle, setTrToggle] = useState(false);
  const [conecsToggle, setConecsToggle] = useState(true);
  const [checkedCB, setCheckedCB] = useState("");
  //const [checkedTr, setCheckedTr] = useState("");
  const [cbImgUrl, setCbImgUrl] = useState("");
  const [payBtn, setPayBtn] = useState(true);
  const [paddingBottom, setPaddingBottom] = useState("20rem");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userForm, setUserForm] = useState(false);

  const {cartItems} = cart

  const stripe = loadStripe(
    "pk_test_51K7i0KDpRgB6XXl9RyZSm0SOAorrK3qP3LN47vKGjVnNsbDG5Mc46c8UGPW9QuW2tPIWex1QN7Ox5ITLHHlnDibZ00nQpru6sm"
  );

  const cbRef = useRef();
  const toPrice = (num) => parseFloat(num).toFixed(2);

  useEffect(() => {
    if (cart) {
      console.log(cart);
      setOrder(cart.cartItems);
    }
  }, [cart]);

  const paymentPopup = () => {
    let element = document.getElementById("paymentPopup");
    if (element.style.visibility === "hidden") {
      element.classList.add("transitionIn");
      element.style.visibility = "visible";
      setIsPopupOpen(true);
      //setPaddingBottom("40rem");
      //setPaddingBottom(element.offsetHeight + 100 + "px");
    } else {
      element.style.visibility = "hidden";
      setIsPopupOpen(false);
    }
  };

  const handleOpen = (openEvent) => {
    setIsPopupOpen(openEvent);
  };

  const handleBalance = (balanceEvent) => {
    setEdenredBalance(balanceEvent);
  };

  const handleCheckedCB = (cbEvent) => {
    setCheckedCB(cbEvent);
  };

  
  const successPaymentHandler = (email1, paymentIntent) => {
    Toast("success", "Paiement réussi");
    dispatch(
      payOrder(cartItems, email1, paymentIntent, axiosInstance)
    );
    localStorage.removeItem("cartItems");
  };

  useEffect(() => {
    if(trToggle === true){
      dispatch(selectPaymentTR("edenred"));
    }
    else if(conecsToggle === true){
      dispatch(selectPaymentTR("conecs"));
    }
    else{
      dispatch(selectPaymentTR(""));
    }
  }, [trToggle, conecsToggle]);


  // useEffect(() => {
  //   if (edenredBalance) {
  //     dispatch(selectPayment(checkedCB, "edenred"));
  //   } else {
  //     dispatch(selectPayment(checkedCB, ""));
  //   }
  // }, [edenredBalance]);

  const submitCB = async() => {

    if(payMethod && (payMethod.CB && payMethod.CB.length > 0 || payMethod.TR && payMethod.TR.length >0)){
      const order_amount = cartItems.itemsPrice
      const state = Statement(payMethod, cartItems)
      console.log(state)
      switch(state){
        case 'CB only':
          // try{
          //   const paymentIntent = await cbRef.current.handleSubmit(cartItems, order_amount, user, payMethod); // Appel de la fonction du composant enfant le plus profond (ChildComponent)
          
          // if(paymentIntent.status === "succeeded"){
          //   successPaymentHandler("", paymentIntent);
          // }
          // }
          // catch(error){
          //   console.log(error)
          // }
          break;

        case 'TR only':
          
          try{
            // EDENRED
            if(payMethod.TR === 'edenred'){
              
              // var capture = await EdenredCapture(order_amount, cartItems, edenredInstance)
              // capture = capture.paymentAuthorization.data
              // try{
              //   const {data} = await EdenredConfirm(capture.authorized_amount, capture.authorization_id, edenredInstance)
              //   const paymentIntent = data.meta
              //   if(paymentIntent.status === "succeeded"){
              //     Toast("success", "Paiement réussi");
              //     successPaymentHandler("", paymentIntent);
              //     localStorage.removeItem("cartItems");
              //   }
              // }catch(error){
              //   EdenredCancel(capture.authorized_amount, capture.authorization_id, edenredInstance)
              //   console.log(error)
              // }
            }
            // CONECS
            else if(payMethod.TR === 'conecs'){
              window.paygreenjs.init({
                paymentOrderID: "po_1c503b35b8274bca89a685163b2301a1",
                objectSecret: "1e45647e1a949869",
                mode: "payment",
                publicKey: "pk_6d92047e838d4870b74857ba47e2eebd",
                instrument: 'ins_b4ec833b26b840cc9404c5e2fbcfca40',
                style: {
                input: {
                    base: {
                    color: "black",
                    fontSize: "18px",
                    },
                },
                },
            });
            }
              
            
            


            }catch(error){
              console.log(error)
            }
          break;

        case 'CB and TR':

          // EDENRED ET CB
          var balance = await edenredInstance.put("/edenred/balance", {
            username: JSON.parse(localStorage.getItem("Edenred")).username,
            access_token: JSON.parse(localStorage.getItem("Edenred"))
              .access_token,
          })
          
          // balance = (balance.data.balance.amount/100) - 0.87
          balance = 10

          try{
            var capture = await EdenredCapture(balance, cartItems, edenredInstance)

            capture = capture.paymentAuthorization.data
            //  if capture.authorized_amount/100 === cartItems.itemsPrice
            // ---> EdenredConfirm

            // try{
            //   const {data} = await EdenredConfirm(capture.authorized_amount, capture.authorization_id, edenredInstance)
            //   const paymentIntent = data
              
            //   if(paymentIntent.meta.status === "succeeded"){
                
            //     const complement_price = parseFloat(toPrice(cartItems.itemsPrice - paymentIntent.data.captured_amount/100))

            //     try{
            //       const paymentIntent = await cbRef.current.handleSubmit(cartItems, complement_price, user, payMethod); // Appel de la fonction du composant enfant le plus profond (ChildComponent)

            //       if(paymentIntent.status === "succeeded"){
            //         successPaymentHandler("", paymentIntent);
            //       }
            //     }
            //     catch(error){
            //       console.log(error)
            //     }

            //   }
            // }catch(error){
            //   // Cancel transaction
            //   const cancel = EdenredCancel(capture.authorized_amount, capture.authorization_id, edenredInstance)
            //   console.log(cancel)
            // }
            
    
          }catch(error){
            console.log(error)
          }

          break;

        case 'Payment cannot be determined':
          console.log('Payment could not be determined')
          break;

        default: 
          console.log('Erreur')
    // // Méthode CB uniquement
    // if (payMethod && payMethod.CB.includes("cb") && cbRef.current && (!payMethod.TR || payMethod.TR.length === 0)) {
    //   // setPayBtn(false);
      
    //   const paymentIntent = await cbRef.current.handleSubmit(cartItems, order_amount, user, payMethod); // Appel de la fonction du composant enfant le plus profond (ChildComponent)
    //   if(paymentIntent.status === "succeeded"){
    //     successPaymentHandler("", order_amount, paymentIntent);
        
    //   }

    // }
    // // Méthode Ticket Resto uniquement
    // else if (payMethod.TR && payMethod.TR.length > 0 && cartItems.itemsPrice === cartItems.itemsPrice_TR && cartItems.itemsPrice_TR <= 25){
    //   // paiment ticket resto
    //   try{
    //     var capture = await EdenredCapture(order_amount, cartItems, edenredInstance)
    //     capture = capture.paymentAuthorization.data

    //     const {data} = await EdenredConfirm(capture.authorized_amount, capture.authorization_id, edenredInstance)
    //     const paymentIntent = data.meta
    //     if(paymentIntent.status === "succeeded"){
    //       Toast("success", "Paiement réussi");
    //       successPaymentHandler("", order_amount, paymentIntent);
    //       localStorage.removeItem("cartItems");
    //     }

    //   }catch(error){
    //     console.log(error)
    //   }
      
     
    }
    // Méthode CB et ticket resto

    }
  else{
    alert('Choisis un moyen de paiement !')
  }



}
  useEffect(() => {
    const cartOrder = document.getElementById("cartOrder");
    cartOrder.style.paddingBottom = paddingBottom;
  }, [paddingBottom]);

  useEffect(() => {
    const element = document.getElementById("paymentPopup");
    if (isPopupOpen) {
      setPaddingBottom(element.offsetHeight + "px");
      //setPaddingBottom("50rem");
    } else {
      setPaddingBottom("20rem");
      element.classList.remove("transitionIn");
      //element.style.visibility = "hidden";
    }
  }, [isPopupOpen]);

  useEffect(() => {
    if (payMethod.CB) {
      if (payMethod.CB.includes("cb")) {
        console.log(payMethod.CB)
        const strinCB = payMethod.CB.split(" ");
        const cbType = strinCB[1];

        switch (cbType) {
          case "visa":
            setCbImgUrl(
              "https://d2csxpduxe849s.cloudfront.net/media/F44207E3-1DDE-4798-B0FCC94F6227FCB7/FD889B2B-B4FE-445C-97A356E3955CC1CC/webimage-ED81074F-347A-430E-AC7CC0A3429D9570.jpg"
            );
            break;
          case "mastercard":
            setCbImgUrl(
              "https://logos-marques.com/wp-content/uploads/2021/07/Mastercard-logo.png"
            );
            break;

          default:
            setCbImgUrl("https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fapple-pay.png?alt=media&token=34b185f5-8928-481d-85aa-07fd5a96e8ec");
      }
      }else{
        console.log("url img")
        setCbImgUrl("https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fapple-pay.png?alt=media&token=34b185f5-8928-481d-85aa-07fd5a96e8ec")
      }
    }
  }, [payMethod]);

  console.log("Pay Method");

  return (
    <>

      <div
        className="flex items-center justify-between px-6 rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-none cart_list  w-full mt-16 "
        onClick={paymentPopup}
      >
        {payMethod.CB  ? (
          <>
            <div className="flex items-center">
              <div className="mr-6 ">
                <img className="h-8" src={cbImgUrl} />
              </div>
              {payMethod.card && payMethod.card.last4  ? (
              <span className="text-xl text-slate-400"> **** {payMethod.card.last4}</span> ) : (<></>)}
            </div>
          </>
        ) : (
          <>
            <div className=" ">
              <img className="h-8" src="/images/plus.svg" />
            </div>
            <span className="text-xl"> Ajouter un moyen de paiement</span>
          </>
        )}

        <div className=" ">
          <img src="/images/nav-arrow-right.svg" />
        </div>
      </div>

      {edenredBalance ? (
        <>
          <div className="flex items-center justify-between px-6 rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-none cart_list  w-full mt-12 ">
            <div className=" flex items-center ">
              <img
                className="h-10 mr-6"
                src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2FEdenred-Logo.png?alt=media&token=48042cb0-3bea-4bb5-948d-4e629a1ae046"
              />

              <span className=" text-lg font-semibold bg-red-100  p-1 px-2 rounded-[5px] text-red-600 ">
                <span className="font-bold">{edenredBalance}</span>€ max
              </span>
            </div>

            <div>
              <input
                type="checkbox"
                id="toggle-btn"
                checked={trToggle}
                className="toggle-btn"
                onChange={() => {conecsToggle === false ? setTrToggle(!trToggle) : <></>}}
              />
              {parseFloat(edenredBalance) > 0 ? <label htmlFor="toggle-btn" className="toggle-label"></label> : <></>}
              
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {localStorage.getItem('Conecs') ? (
        <>
          <div className="flex items-center justify-between px-6 rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-none cart_list  w-full mt-12 ">
            <div className=" flex items-center ">
              <img
                className="h-10 mr-6"
                src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2FEdenred-Logo.png?alt=media&token=48042cb0-3bea-4bb5-948d-4e629a1ae046"
              />

              <span className=" text-lg font-semibold bg-red-100  p-1 px-2 rounded-[5px] text-red-600 ">
                <span className="font-bold">{(JSON.parse(localStorage.getItem('Conecs')).balance/100).toFixed(2).replace(".", ",")}</span>€ max
              </span>
            </div>

            <div>
              <input
                type="checkbox"
                id="toggle-conecs"
                checked={conecsToggle}
                className="toggle-btn"
                onChange={() => {trToggle === false ? setConecsToggle(!conecsToggle) : <></>}}
              />
              {/* {JSON.parse(localStorage.getItem('Conecs')).balance > 0 ? <label htmlFor="toggle-conecs" className="toggle-label"></label> : <></>} */}
              <label htmlFor="toggle-conecs" className="toggle-label"></label>

            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {!isPopupOpen ? (
        <>
          {payBtn ? (
            <>
              {payMethod.CB && payMethod.CB.includes("applepay") && order ? (
                <>
                  <div className="w-full mt-16 ">
                    <Elements stripe={stripe}>
                      <ApplePay order={order} axiosInstance={axiosInstance} />
                    </Elements>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <button
                      className="my-12 pikko-btn shadow-none text-2xl h-16 rounded-full"
                      onClick={submitCB}
                    >
                      <div className="flex items-center justify-center">
                        Payer
                        {payMethod.CB &&
                        payMethod.CB.includes("cb") &&
                        !payMethod.TR ? (
                          <>
                            {" "}
                            avec
                            <img className="h-8 ml-4" src={cbImgUrl} />{" "}
                          </>
                        ) : (
                          <></>
                        )}
                        {payMethod.TR &&
                        payMethod.TR.includes("edenred") &&
                        !payMethod.CB ? (
                          <>
                            {" "}
                            avec
                            <img
                              className="h-8 ml-4"
                              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2FEdenred-Logo.png?alt=media&token=48042cb0-3bea-4bb5-948d-4e629a1ae046"
                            />{" "}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="lds-spinner scale-50">
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
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <PopupPayment
        ref={cbRef}
        open={handleOpen}
        openStatus={isPopupOpen}
        order={order}
        axiosInstance={axiosInstance}
        edBalance={handleBalance}
        cb={handleCheckedCB}
      />
    </>
  );
};

export default Checkout;
