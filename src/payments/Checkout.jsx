import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPayment } from "../actions/orderActions";
import useAxiosInterceptors from "../axios/useAxios";
import PopupPayment from "./PopupPayment";
import ApplePay from "./Stripe/ApplePay";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const Checkout = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptors();
  const cart = useSelector((state) => state.cart);
  const [order, setOrder] = useState(null);
  const payMethod = useSelector((state) => state.payMethod);
  const [edenredBalance, setEdenredBalance] = useState();
  const [trToggle, setTrToggle] = useState(true);
  const [checkedCB, setCheckedCB] = useState("");
  //const [checkedTr, setCheckedTr] = useState("");
  const [cbImgUrl, setCbImgUrl] = useState("");
  const [payBtn, setPayBtn] = useState(true);
  const [paddingBottom, setPaddingBottom] = useState("20rem");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userForm, setUserForm] = useState(false);

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

  const handleEdToggle = (toggleEvent) => {
    console.log("clickclick");
    setTrToggle(!trToggle);
  };

  useEffect(() => {
    if (trToggle && edenredBalance) {
      dispatch(selectPayment(checkedCB, "edenred"));
    } else {
      dispatch(selectPayment(checkedCB, ""));
    }
  }, [trToggle]);

  useEffect(() => {
    console.log("ma balance");
    console.log(edenredBalance);
    if (edenredBalance) {
      dispatch(selectPayment(checkedCB, "edenred"));
    } else {
      dispatch(selectPayment(checkedCB, ""));
    }
  }, [edenredBalance]);

  const submitCB = () => {
    if (payMethod && payMethod.CB.includes("cb") && cbRef.current) {
      setPayBtn(false);
      cbRef.current.handleSubmit(order); // Appel de la fonction du composant enfant le plus profond (ChildComponent)
    }
  };

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
  console.log(payMethod);

  return (
    <>
      {trToggle && payMethod.TR ? (
        <>
          <div className="px-8">
            <div className="pt-4 flex justify-between items-center flex-nowrap">
              <div className="opacity-60 text-xl">Titre Restaurant &nbsp;</div>

              <div className="opacity-60 flex text-2xl">
                {toPrice(cart.cartItems.itemsPrice_TR).replace(".", ",")}
                {/*toPrice(localTotal).replace(".", ",")*/}€
              </div>
            </div>

            {cart.cartItems.itemsPrice - cart.cartItems.itemsPrice_TR > 0 ? (
              <>
                <div className="pt-4 flex justify-between items-center flex-nowrap">
                  <div className="opacity-60 text-xl">
                    Montant à compléter &nbsp;
                  </div>

                  <div className="opacity-60 flex text-2xl">
                    {toPrice(
                      cart.cartItems.itemsPrice - cart.cartItems.itemsPrice_TR
                    ).replace(".", ",")}
                    {/*toPrice(localTotal).replace(".", ",")*/}€
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

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
              {payMethod.CB.includes("cb")  ? (
              <span className="text-xl text-slate-400"> **** 4242</span> ) : (<></>)}
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
                checked={trToggle === true}
                className="toggle-btn"
                onChange={handleEdToggle}
              />
              <label htmlFor="toggle-btn" className="toggle-label"></label>
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
