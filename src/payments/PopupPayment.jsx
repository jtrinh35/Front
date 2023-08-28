import React, { useEffect, useState, forwardRef, useRef } from "react";
import Edenred from "./Edenred/Edenred";
import CreditCard from "./Stripe/CreditCard";
import UserForm from "./Stripe/UserForm";
import { selectPaymentCB, selectPaymentTR } from "../actions/payMethodActions";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaygreenConecs from "./Paygreen/PaygreenConecs";

const PopupPayment = (
  { open, openStatus, order, axiosInstance, edBalance, conecsBalance, cb },
  ref
) => {
  const stripe = loadStripe(
    "pk_test_51K7i0KDpRgB6XXl9RyZSm0SOAorrK3qP3LN47vKGjVnNsbDG5Mc46c8UGPW9QuW2tPIWex1QN7Ox5ITLHHlnDibZ00nQpru6sm"
  );
  const dispatch = useDispatch();
  const [checkedCB, setCheckedCB] = useState("");
  const [checkedTR, setCheckedTR] = useState("");
  const [isCBContentVisible, setIsCBContentVisible] = useState(false);
  const [isTRContentVisible, setIsTRContentVisible] = useState(false);
  const [isPayOptionsVisible, setIsPayOptionsVisible] = useState(false);
  const [cardType, setCardType] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [cbForm, setCbForm] = useState();
  const [validBtn, setValidBtn] = useState(true);
  const [userForm, setUserForm] = useState();
  const [popupOpen, setPopupOpen] = useState(openStatus);
  const paygreenref = useRef();
  // if(paygreenref){
  //   console.log(paygreenref)
  //   paygreenref.current.hello()

  // }
  useEffect(() => {
    if (checkedCB.includes("cb")) {
      setIsCBContentVisible(true);
      setValidBtn(cbForm ? true : false);
    } 
    else if (checkedCB.includes("conecs")) {
      setIsTRContentVisible(true);
      setValidBtn(cbForm ? true : false);
    } 
    else {
      setValidBtn(true);
      setIsCBContentVisible(false);
      setIsTRContentVisible(false)
    }
    cb(checkedCB);
    console.log(validBtn)
  }, [checkedCB]);
  useEffect(()=> {
    if(localStorage.getItem('paygreen') === true) setValidBtn(true)
    
  }, [localStorage.getItem('paygreen')])
  useEffect(() => {
    if (checkedCB.includes("cb")) {
      setValidBtn(cbForm ? true : false);
    } else {
      setIsCBContentVisible(false);
    }
  }, [cbForm]);

  const handleChange = (id) => {
    setCheckedCB((prevCheckedId) => (prevCheckedId === id ? "" : id));
  };
  function selectedPayment() {
    console.log("---------------------hello")
    console.log(checkedCB)
    if (checkedCB.includes("cb")) {
      // dispatch(selectPaymentTR(checkedTR));
      dispatch(selectPaymentCB(cardType))
      // cb("cb " + cardType);
    }
    else if(checkedCB === 'applepay'){
      dispatch(selectPaymentCB(checkedCB))
    } 
    else {

      if(window.paygreenjs){
        window.paygreenjs.submitPayment()
      }
    }
    // popup();
    setIsCBContentVisible(false);
  }

  const handleToggleSlide = (id) => {
    handleChange(id);
  };

  const handleCardChange = (cardChangeEvent) => {
    setCardType(cardChangeEvent[0]);
  };

  const handleSaveCard = (saveCardEvent) => {
    console.log(saveCardEvent)
    setSaveCard(saveCardEvent);
  };

  const handleFormComplete = (formChangeEvent) => {

    if (formChangeEvent === false) {
      setCbForm(false);
      setValidBtn(false);
    } else {
      setCbForm(true);
      setValidBtn(true);
    }
  };

  const handleInstrument = (instrument) => {
    if(instrument === true){
      dispatch(selectPaymentTR("conecs"));
    }else{
      // handle error instrument
      setCbForm(false);
      setValidBtn(false);
    }

  }

  const handleUserForm = (userFormEvent) => {
    setUserForm(userFormEvent);
  };

  const handleBalance = (balanceEvent) => {
    edBalance(balanceEvent);
  };

  const handlePayOptions = () => {
    setIsPayOptionsVisible(!isPayOptionsVisible);
  };

  const popup = () => {
    let element = document.getElementById("paymentPopup");
    let cb = document.getElementById("cbpopup");
    let payOptions = document.getElementById("payOptionsForm");
    let userForm = document.getElementById("userForm");
    if (element.style.visibility === "hidden") {
      element.style.visibility = "visible";
    } else {
      setPopupOpen(false);
      //userForm.style.visibility = "hidden";
      //payOptions.style.visibility = "hidden";
      element.style.visibility = "hidden";

      open(false);
      setIsPayOptionsVisible(false);

      setIsCBContentVisible(false);
      //element.style.visibility = "hidden";
    }
  };

  return (
    <>
      {/* <div className="cartscreen w-screen min-h-screen flex flex-col justify-center items-center p-10 "> */}
      <div
        id="paymentPopup"
        className="fixed bottom-0 left-0 z-50 h-[85%] bg-white w-screen rounded-t-[16px] py-16 pt-8 px-8 shadow-[0_-7px_24px_-13px_rgba(0,0,0,0.14)] flex flex-col overflow-auto "
        style={{ visibility: "hidden" }}
      >
        <div className="h-full">
          <button className="border-none self-start">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fpopup_cross.png?alt=media&token=85ef2558-f156-4bb2-ae74-00d3493ada5c"
              alt="close"
              className="h-8"
              onClick={popup}
            />
          </button>

          <UserForm formDone={handleUserForm} openStatus={openStatus} />

          {userForm ? (
            <>
              {" "}
              <div
                className={`flex items-center justify-between rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 w-full flex-wrap ${
                  isPayOptionsVisible ? "slide-down-btn" : ""
                }`}
                onClick={handlePayOptions}
              >
                <span className="text-2xl"> Options de paiement </span>
                <div
                  className={`nav-arrow-r ${
                    isPayOptionsVisible ? "rotate-90" : ""
                  }`}
                >
                  <img src="/images/nav-arrow-right.svg" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className={`flex items-center justify-between rounded-[10px] text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 w-full flex-wrap  relative`}
              >
                <span className="text-2xl opacity-50">
                  {" "}
                  Options de paiement{" "}
                </span>
                <div className="nav-arrow-r opacity-50">
                  <img src="/images/nav-arrow-right.svg" />
                </div>
                <div
                  className={`flex items-center justify-between rounded-[10px] text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 opacity-5 px-8 w-full flex-wrap bg-black absolute left-0 w-full`}
                ></div>
              </div>
            </>
          )}

          {/* <h2 className="text-center text-4xl mb-8">Options de paiement</h2> */}

          <div
            id="payOptionsForm"
            className={`border-solid border-[0.5px] border-slate-300 p-8 rounded-[10px] pb-16 ${
              isPayOptionsVisible
                ? "slide-down-content visible"
                : "slide-down-content"
            } ${openStatus ? "slide-down-transition" : ""}`}
          >
            {/* ApplePay */}
            <div
              className="flex items-center rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 pr-14 w-full my-8"
              onClick={() => handleToggleSlide("applepay")}
            >
              <label className="custom-checkbox">
                <input
                  className="w-8 "
                  type="checkbox"
                  checked={checkedCB === "applepay"}
                  onChange={() => handleChange("applepay")}
                />
                <span className="checkmark"></span>
              </label>
              <div className="w-full flex justify-center">
                <img
                  className="h-8"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png"
                />
              </div>
            </div>
            
            {/* CB */}

            <div
              className={`flex items-center rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 pr-14 w-full flex-wrap ${
                isCBContentVisible ? "slide-down-btn bg-slate-100" : ""
              }`}
              onClick={() => {handleToggleSlide("cb")
              setIsTRContentVisible(false)}}
            >
              <label className="custom-checkbox">
                <input
                  className="w-8 "
                  type="checkbox"
                  checked={checkedCB.includes("cb")}
                  onChange={() => handleChange("cb")}
                />
                <span className="checkmark"></span>
              </label>
              <div className="px-8 ">
                <img
                  className="h-6 rounded-[5px]"
                  src="https://d2csxpduxe849s.cloudfront.net/media/F44207E3-1DDE-4798-B0FCC94F6227FCB7/FD889B2B-B4FE-445C-97A356E3955CC1CC/webimage-ED81074F-347A-430E-AC7CC0A3429D9570.jpg"
                />

                <img
                  className="h-6"
                  src="https://logos-marques.com/wp-content/uploads/2021/07/Mastercard-logo.png"
                />
              </div>
              <span className="text-xl"> Carte Bancaire </span>
            </div>

            <div
              id="cbpopup"
              className={`flex items-center rounded-[10px] bg-white text-black h-0 w-auto h-full border-solid border-[0.5px] border-slate-300 px-8  bg-slate-50 w-full flex-wrap slide-down-transition ${
                isCBContentVisible
                  ? "slide-down-content  visible grey-bg"
                  : "slide-down-content"
              }`}
            >
              <div className="w-full mt-16 ">
                <Elements stripe={stripe}>
                  <CreditCard
                    ref={ref}
                    order={order}
                    axiosInstance={axiosInstance}
                    card={handleCardChange}
                    formComplete={handleFormComplete}
                  />
                </Elements>
              </div>
            </div>

            <h3 className="text-3xl text-left my-8 mt-16">Titres Restaurant</h3>

            {/* Edenred */}
              
            <Edenred balance={handleBalance} onChange={handleChange} />

            {/* Conecs */}
            <div
              className={`flex items-center rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 pr-14 w-full flex-wrap ${
                isTRContentVisible ? "slide-down-btn bg-slate-100" : ""
              }`}
              onClick={() => {handleToggleSlide("conecs")
              setIsCBContentVisible(false)}}
            >
              <label className="custom-checkbox">
                <input
                  className="w-8 "
                  type="checkbox"
                  checked={checkedCB.includes("conecs")}
                  onChange={() => handleChange("conecs")}
                />
                <span className="checkmark"></span>
              </label>
              <div className="px-8 ">
                <img
                  className="h-6 rounded-[5px]"
                  src="https://d2csxpduxe849s.cloudfront.net/media/F44207E3-1DDE-4798-B0FCC94F6227FCB7/FD889B2B-B4FE-445C-97A356E3955CC1CC/webimage-ED81074F-347A-430E-AC7CC0A3429D9570.jpg"
                />

                <img
                  className="h-6"
                  src="https://logos-marques.com/wp-content/uploads/2021/07/Mastercard-logo.png"
                />
              </div>
              <span className="text-xl"> Sodexo / Up / Bimpli (ex Apetiz)</span>
            </div>

            <div
              id="conecspopup"
              className={`flex items-center rounded-[10px] bg-white text-black h-0 w-auto h-full border-solid border-[0.5px] border-slate-300 px-8  bg-slate-50 w-full flex-wrap slide-down-transition ${
                isTRContentVisible
                  ? "slide-down-content  visible grey-bg"
                  : "slide-down-content"
              }`}
            >
              <div className="w-full mt-16 ">
                <PaygreenConecs 
                /* formComplete={handleFormComplete}*/
                formComplete={handleFormComplete}
                instrumentComplete={handleInstrument}
                />
              </div>
            </div>
            
          </div>
          {validBtn ? (
            <>
              <div className="flex flex-col">
                <button
                  
                  className="my-16 pikko-btn shadow-none text-2xl h-16 rounded-full"
                  // onClick={selectedPayment}
                  
                  onClick={
                    () => {
                      selectedPayment()
                      // if conecs fonction qui va get l'instrument, if good alors selectedPayment et setCheckedTR(sodexo ou else) else error
                      // else 
                    }
                  }
                >
                  Valider
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <button
                  className="my-16 bg-yellow-300 shadow-none text-3xl h-16 rounded-full opacity-25 border-none"
                  disabled
                >
                  Valider
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default forwardRef(PopupPayment);
