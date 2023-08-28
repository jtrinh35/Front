import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { payOrder } from "../../actions/orderActions";
import { Toast } from "../../components/Toast";
import { addUserId } from "../../actions/userActions";

const CreditCard = ({ order, axiosInstance, formComplete, card, persistentCard }, ref) => {
  // ({ order, axiosInstance } = order);

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [email1, setEmail1] = useState("");
  const [validemail, setValidemail] = useState(false);
  const [loadingaxios, setLoadingAxios] = useState(false);

  const [focusedElement, setFocusedElement] = useState(null);

  const [payBtn, setPayBtn] = useState(true);
  const [cardType, setCardType] = useState();

  const [cardNbComplete, setCardNbComplete] = useState();
  const [cardExpComplete, setCardExpComplete] = useState();
  const [cardCVCComplete, setCardCVCComplete] = useState();
  // const [isFormComplete, setIsFormComplete] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  let paymentIntent, email, promotion, pr;

  useEffect(() => {
    if (elements) {
      elements
        .getElement(CardNumberElement)
        .on("networkschange", function (event) {
          if (event.networks && event.networks.length >= 1) {
            setCardType(event.networks);
            card(event.networks);
          }
        });

      elements.getElement(CardNumberElement).on("change", function (event) {
        const { complete } = event;
        if (complete) {
          setCardNbComplete(true);
        } else {
          setCardNbComplete(false);
        }
      });

      elements.getElement(CardExpiryElement).on("change", function (event) {
        const { complete } = event;
        if (complete) {
          setCardExpComplete(true);
        } else {
          setCardExpComplete(false);
        }
      });

      elements.getElement(CardCvcElement).on("change", function (event) {
        const { complete } = event;
        if (complete) {
          setCardCVCComplete(true);
        } else {
          setCardCVCComplete(false);
        }
      });

      //setFormCompletion(tempForm);
      //formComplete(tempForm);
    }
  }, [elements]);

  console.log("saveCard ? " +saveCard)
  /*useEffect(() => {
    console.log("formCompletion has changed");
    if (formCompletion.card && formCompletion.cvc && formCompletion.exp) {
      setIsFormComplete(true);
      formComplete(true);
    }
  }, [formCompletion.card, formCompletion.cvc, formCompletion.exp]);*/

  useEffect(() => {

    if (cardNbComplete && cardExpComplete && cardCVCComplete) {
      // setIsFormComplete(true);
      formComplete(true);
    } else {
      // setIsFormComplete(false);
      formComplete(false);
    }
  }, [cardNbComplete, cardExpComplete, cardCVCComplete]);


  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSubmit = async (order, order_amount, user, pm) => {
    // if(AgeRestriction(order).props.children){
    //     console.log("illégal")
    //     return
    // }
    // else{
    setPayBtn(false);
    let customerId

    // if (validemail || email1.length === 0) {
      try {
        let response;
        setLoadingAxios(true);
        if(user) {
          console.log(user.id)
          user.id && user.id.length > 0 ? customerId = user.id : customerId = ""
          if(pm.card && pm.card.id && pm.card.id.length > 0 && saveCard === false){
            // fonction paiement rapide sans paymentIntent status
            console.log("hello")
            response = await axiosInstance.post("/stripe/payment", {

              amount: order_amount,
              customerId: customerId,
              storeId: order.storeId,
              pm: pm.card.id
  
            }
            
            )
            if(response.data.message === "Paiement réussi"){
              const rep = await axiosInstance.post("/stripe/receipt", {
                id: response.data.paymentIntentId,
              });
              localStorage.setItem("receipt_url", rep.data);

              // Toast("success", "Paiement réussi");
              // order.isPaid = true;
              // successPaymentHandler(email1, order_amount);
              // localStorage.removeItem("cartItems");
              console.log(paymentIntent)
              paymentIntent = {status: "succeeded"}
              console.log(paymentIntent)
              return paymentIntent
            }
            else{
                setLoadingAxios(false);
                Toast("error", "Paiement échoué");
            }
          }
          else{
              // paiement lent
              console.log("-------------" + user + "------------" +saveCard)
              response = await axiosInstance.post("/stripe/payment", {

                amount: order_amount,
                name : user.name,
                email : user.email,
                customerId: customerId,
                storeId: order.storeId,
                saveCard: saveCard
    
              });

              if (response.data.customer && response.data.customer.length > 0) {
                dispatch(addUserId(response.data.customer))
              }
              const data = await response.data;
              
              const cardElement = elements.getElement(CardNumberElement);
              const confirmPayment = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                  payment_method: { card: cardElement },
                }
              );
              console.log(confirmPayment)
              paymentIntent = confirmPayment.paymentIntent;
              console.log(paymentIntent);
              if (paymentIntent.status === "succeeded") {
                const rep = await axiosInstance.post("/stripe/receipt", {
                  id: paymentIntent.id,
                });
      
                console.log(rep);
                localStorage.setItem("receipt_url", rep.data);
                if (validemail && email1.length > 0) {
                  axiosInstance.post("/mail", {
                    order_price: order_amount,
                    email: email1,
                    order_id: order._id,
                    order: order.orderItems,
                  });
                }
                return paymentIntent
                // Toast("success", "Paiement réussi");
                // order.isPaid = true;
                // successPaymentHandler(email1, order_amount);
                // localStorage.removeItem("cartItems");
              } else {
                setLoadingAxios(false);
                Toast("error", "Paiement échoué");
                // toast.error("Paiement échoué")
              }
                    

        } 
          

        

        }
        
        
      } catch (error) {
        setLoadingAxios(false);
        console.log("Error! ", error);
        Toast("error", "Paiement échoué");
        // toast.error("Paiement échoué")
      }
    // } else {
    //   setLoadingAxios(false);
    //   Toast("error", "Email invalide");
    //   // toast.error("email invalide")
    // }
    setPayBtn(true);
  };

  const handleFocus = (element) => {
    setFocusedElement(element); // Set the currently focused element
  };

  const handleSaveCard = (state) => {
    setSaveCard(!saveCard);
  };

  const inputStyle = {
    color: "rgba(0, 0, 0, 1)",

    "::placeholder": {
      color: "rgba(0, 0, 0, 0.5)",
      fontSize: "12px",
    },
  };
  const successPaymentHandler = (email1) => {
    dispatch(
      payOrder(order, email1, paymentIntent, axiosInstance)
    );
  };

  return (
    <div>
      <div id="stripe">
        <div>
          <p className="text-lg font-intermedium">Numéro de carte</p>
          <CardNumberElement
            className={`stripe_card ${focusedElement === 1 ? "focused" : ""}`}
            options={{ style: { base: inputStyle } }}
            onFocus={() => handleFocus(1)}
          />
          {/* options={{style:{base:{'::placeholder': {color: '#FFFFFF'},}}}} */}
        </div>
        <div className="pr-8">
          <p className="text-lg font-intermedium">Date d'expiration</p>
          <CardExpiryElement
            className={`stripe_card ${focusedElement === 2 ? "focused" : ""}`}
            options={{ style: { base: inputStyle } }}
            onFocus={() => handleFocus(2)}
          />
        </div>
        <div className="pl-8">
          <p className="text-lg font-intermedium">Cryptogramme</p>
          <CardCvcElement
            className={`stripe_card ${focusedElement === 3 ? "focused" : ""}`}
            options={{ style: { base: inputStyle } }}
            onFocus={() => handleFocus(3)}
          />
        </div>
      </div>
      <div className="flex items-center"> <input className="mr-4" type="checkbox" checked={saveCard} onChange={handleSaveCard}/>Enregistrer ma carte </div>
      {payBtn ? (
        <></>
      ) : (
        /*<button
          className="pikko-btn rounded-full mt-4 py-6 justify-self-end pikko-btn w-full text-center"
          onClick={() => handleSubmit(order)}
        >
          Payer
        </button>*/
        <>
          {/* <div className="flex justify-center">
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
          </div> */}
        </>
      )}
    </div>
  );
};

export default forwardRef(CreditCard);
