import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paygreenCreateBuyer } from "./PaygreenPayment";
import { useSelector } from "react-redux";
import useAxiosInterceptors from "../../axios/useAxios";
import axios from "axios";


const PaygreenConecs = ({formComplete, instrumentComplete}) => {
  const navigate = useNavigate();
  const [scriptLoad, setScriptLoad] = useState(false)
  const user = useSelector((state) => state.user)
  const [handleClick, setHandleClick] = useState(() => {console.log("hello")})
  const [cardNbComplete, setCardNbComplete] = useState();
  const [cardExpComplete, setCardExpComplete] = useState();
  const [cardCVCComplete, setCardCVCComplete] = useState();
  const [instrument, setInstrument] = useState()
  const [unmount, setUnmount] = useState(false)
  
  const axiosInstance = useAxiosInterceptors()
  // function payment2(paygreenjs){
  //   paygreenjs.init({
  //     paymentOrderID: "po_ba844e2cdfe94e57baaf959ea8643430",
  //     objectSecret: "266e4c194a8407c8",
  //     mode: "payment",
  //     publicKey: "pk_6d92047e838d4870b74857ba47e2eebd",
  //     instrument: 'ins_c03ebf28369741528eedfed85bedd866',
  //     style: {
  //     input: {
  //         base: {
  //         color: "black",
  //         fontSize: "18px",
  //         },
  //     },
  //     },
  // });
  // }


  useEffect(() => {
    if(instrument){
      instrumentComplete(true)
    }else{
      instrumentComplete(false)
    }
  }, [instrument])

  useEffect(() => {

    if (cardNbComplete && cardExpComplete && cardCVCComplete) {
      // setIsFormComplete(true);
      formComplete(true);
    } else {
      // setIsFormComplete(false);
      formComplete(false);
    }
  }, [cardNbComplete, cardExpComplete, cardCVCComplete]);

  useEffect(() => {
    // if(localStorage.getItem('paygreen-startflow') && localStorage.getItem('paygreen-startflow') !== null){
    const script = document.createElement("script");
    script.src = "https://sb-pgjs.paygreen.fr/latest/paygreen.min.js";
    script.async = true;
   
    script.onload = () => {

      setScriptLoad(true)

    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
    // }
    
  }, []);


  useEffect(() => {

    if(!scriptLoad || !window.paygreenjs) return

    
    window.paygreenjs.init({
      publicKey: "pk_6d92047e838d4870b74857ba47e2eebd",
      mode: "instrument",
      // buyer: "buy_2e3f9d6487cd440098e0d04ac728fc5f",
      paymentMethod: "conecs",
      modeOptions: {
        //authorizedInstrument: true,
        shopId: 'sh_69b974d635c34df18c807baed0794836',
      },
    });

    // document.getElementById("paygreen-startflow").addEventListener("click", payment);
    // document.getElementById("payButton2").addEventListener("click", payment2(paygreenjs));
      window.paygreenjs.attachEventListener(
        window.paygreenjs.Events.INSTRUMENT_READY,
        (event) => {
          console.log("---------instrument ready")
          console.log(event.detail.instrument)
          setInstrument(true)
          window.paygreenjs.unmount()
          setUnmount(true)
          paygreenCreateBuyer(user, axiosInstance).then((response)=>{
            console.log(response)
            const conecs = {
              buyerId: response.data.data.id,
              email: response.data.data.email,
              firstName: response.data.data.first_name,
              lastName: response.data.data.last_name,
              instrument: event.detail.instrument.id, 
              balance: event.detail.instrument.daily_balance, 
              issuer: event.detail.instrument.issuer
            }
          localStorage.setItem('Conecs', JSON.stringify(conecs))
          })
          setInstrument(true)
          // localStorage.setItem('instrument', event.detail.instrument)
          // createdOrder(intrument.id)
        }
      );
      window.paygreenjs.attachEventListener(
        window.paygreenjs.Events.FULL_PAYMENT_DONE,
        (event) => console.log("Payment success"),
      );
      window.paygreenjs.attachEventListener(
        window.paygreenjs.Events.REUSABLE_ALLOWED_CHANGE,
        (event) => 
        console.log("hello"),
      );
  
  
      window.paygreenjs.attachEventListener(window.paygreenjs.Events.PAN_FIELD_FULFILLED, (event) => {
        console.log('TOKEN_READY', event);
        document.getElementById("pan-check").classList.remove("invisible")
        setCardNbComplete(true)
      });
  
      window.paygreenjs.attachEventListener(window.paygreenjs.Events.EXP_FIELD_FULFILLED, (event) => {
        console.log('TOKEN_READY', event.detail);
        document.getElementById("exp-check").classList.remove("invisible")
        setCardExpComplete(true)
      });
  
      window.paygreenjs.attachEventListener(window.paygreenjs.Events.CVV_FIELD_ONCHANGE, (event) => {
        console.log('TOKEN_READY', event.detail);
        if(event.detail.valid){
          document.getElementById("cvv-check").classList.remove("invisible")    
          setCardCVCComplete(true)     
        }
        else{
          setCardCVCComplete(false)
        }
      });
  
      //     window.paygreenjs.init({
      //     publicKey: "pk_6d92047e838d4870b74857ba47e2eebd",
      //     mode: "instrument",
      //     buyer: "buy_2e3f9d6487cd440098e0d04ac728fc5f",
      //     paymentMethod: "conecs",
      //     modeOptions: {
      //                     shopId: 'sh_69b974d635c34df18c807baed0794836' ,
      //                     reuse_allowed: true
      //                 },
      //   });

    ;

  }, [scriptLoad])

  return (
    <>  
    <script defer type="text/javascript" src="https://sb-pgjs.paygreen.fr/latest/paygreen.min.js"> </script>

    <link href="https://sb-pgjs.paygreen.fr/latest/paygreen.min.css" type="text/css" rel="stylesheet" /> 
    {unmount === false ? (
      <div id="paygreen-conecs" className="h-full w-full">
      <div id="paygreen-container"></div>
          <div id="paygreen-methods-container"></div>

          <div className="paygreen-form">
          <div>
            <label className="text-sm mb-12 ">Card number</label>
            <div className="mt-2 " id="paygreen-pan-frame"><img id="pan-check" className="absolute right-0 bottom-0 h-6 invisible" src="/images/check-2.svg" /></div>
            
          </div>
        
          <div className="line">
            <div>
            <label className="text-sm">Expiration</label>
            <div className="mt-2"  id="paygreen-exp-frame"> <img id="exp-check" className="absolute right-0 bottom-0 h-6 invisible" src="/images/check-2.svg" /></div>
            
            </div>
            <div className="paygreen-cvv-container">
            <label className="text-sm">CVV </label>
            <div className="mt-2" id="paygreen-cvv-frame"></div>
            <img id="cvv-check" className="absolute right-0 bottom-0 h-6 invisible" src="/images/check-2.svg" />
            <i data-feather="help-circle" ></i>
            </div>
        
          </div>
        
          <div id="paygreen-reuse-checkbox-container"></div>
          {/* <div className="icon-sentence">
            <button id="payButton" className="pikko-btn shadow-none h-8 my-4 rounded-full" onClick={handleClick}>Valider</button>
            <button id="payButton2" className="pikko-btn shadow-none h-8 my-4 rounded-full" onclick={handleClick}>Valider2</button>


            <i data-feather="lock"></i>
            <label className="secured-label"> Payment secured and powered by <strong>Paygreen</strong></label>
          </div> */}
        
          </div>
        </div>

    ) : (
      <>
        <div>hello world</div>
        <div id="paygreen-container"></div>
      </>
      
    )}
    	
      
    </>
  );
};

export default PaygreenConecs;