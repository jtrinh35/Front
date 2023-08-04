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

const CreditCard = ({ order, axiosInstance, formComplete, card }, ref) => {
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
  const [isFormComplete, setIsFormComplete] = useState(false);
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
            console.log(event.networks);
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

  console.log("order dans creditCard");
  console.log(order);
  useEffect(() => {
    console.log("form has changed");

    if (cardNbComplete && cardExpComplete && cardCVCComplete) {
      setIsFormComplete(true);
      formComplete(true);
    } else {
      setIsFormComplete(false);
      formComplete(false);
    }
  }, [cardNbComplete, cardExpComplete, cardCVCComplete]);

  console.log("isFormComplete : " + isFormComplete);

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSubmit = async (order) => {
    console.log("trying to pay");
    console.log(order);
    // if(AgeRestriction(order).props.children){
    //     console.log("illégal")
    //     return
    // }
    // else{
    setPayBtn(false);

    let order_amount = order.itemsPrice;

    if (validemail || email1.length === 0) {
      try {
        let response;
        setLoadingAxios(true);
        if (saveCard && localStorage.getItem("user")) {
          const user = JSON.parse(localStorage.getItem("user"));
          response = await axiosInstance.post("/stripe/payment", {
            amount: order_amount,
            name : user.name,
            email : user.email,
            //receipt_email: email1,
            storeId: order.storeId,
          });
          console.log("response payment")
          console.log(response)
          localStorage.setItem("customer_id", response.data.customer);

        } else if(localStorage.getItem("customer_id")){
          const customer = localStorage.getItem("customer_id");
          const user = JSON.parse(localStorage.getItem("user"));
          response = await axiosInstance.post("/stripe/payment", {
            amount: order_amount,
            email : user.email,
            customerId : customer,
            storeId: order.storeId,
          });
          console.log("response automatic payment ")
          console.log(response)
          order.isPaid = true;
        } else {
          response = await axiosInstance.post("/stripe/payment", {
            amount: order_amount,
            storeId: order.storeId,
          });
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
          const rep = await axiosInstance.post("/products", {
            id: paymentIntent.id,
          });
          console.log(rep.data);
          localStorage.setItem("receipt_url", rep.data);
          if (validemail && email1.length > 0) {
            axiosInstance.post("/mail", {
              order_price: order_amount,
              email: email1,
              order_id: order._id,
              order: order.orderItems,
            });
          }
          setLoadingAxios(false);
          Toast("success", "Paiement réussi");
          // toast.success("Paiement réussi")
          order.isPaid = true;
          successPaymentHandler(email1, order_amount);
          localStorage.removeItem("cartItems");
        } else {
          setLoadingAxios(false);
          Toast("error", "Paiement échoué");
          // toast.error("Paiement échoué")
        }
      } catch (error) {
        setLoadingAxios(false);
        console.log("Error! ", error);
        Toast("error", "Paiement échoué");
        // toast.error("Paiement échoué")
      }
    } else {
      setLoadingAxios(false);
      Toast("error", "Email invalide");
      // toast.error("email invalide")
    }
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
  const successPaymentHandler = (email1, order_amount) => {
    dispatch(
      payOrder(order, email1, paymentIntent, axiosInstance, order_amount)
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
