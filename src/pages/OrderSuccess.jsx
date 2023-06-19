import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { comOrder, detailsOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import QRCode from "qrcode";
import { useNavigate } from "react-router";
import Config from "../axios/Config";
import useAxiosInterceptors from "../axios/useAxios";
import Invoice from "../components/Invoice";
import Rating from "../components/Rating";
import axios from "axios";

const OrderSuccess = () => {
  const toPrice = (num) => parseFloat(num).toFixed(2);
  window.scrollTo(0, 0);

  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const [QrCode, setQrCode] = useState("");
  const { store } = useSelector((state) => state.store);
  const { orderId } = useParams();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const [com, setCom] = useState("");
  const [iscom, setIscom] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart); //prendre le state de cart de redux store

  if (order) {
    if (order.isPaid === false) {
      navigate(`/order/${order._id}`);
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
    dispatch(detailsOrder(orderId, axiosInstance));
    try {
      QRCode.toDataURL(`https://www.test.pikkopay.fr/check/${orderId}`, {
        /*color: {dark: "#755FE2", light:"#00FFFFFF"},*/ margin: 0,
      }).then(setQrCode);
    } catch (err) {
      console.log(err);
    }
  }, [orderId, dispatch]);

  const getData = (val) => {
    setCom(val.target.value);
    console.log(com);
  };

  const comSubmit = () => {
    dispatch(comOrder(order._id, com, axiosInstance));
    setIscom(true);
  };

  const popup = () => {
    let element = document.getElementById("orderPopup");
    if (element.style.visibility === "hidden") {
      element.style.visibility = "visible";
    } else {
      element.style.visibility = "hidden";
    }
  };



  // const [instance, updateInstance] = usePDF({ document: MyDocument });
  return loading || !orderDetails || !store ? (
    <div class="loader loader-default is-active"></div>
  ) : (
    <>
      {order ? (
        <div id="invoice" className="flex flex-col gap-10 p-8 bg-white">
          {/* {Invoice(orderDetails, store)} */}
          <div className="flex flex-col justify-center gap-14 mt-10">
            <div className="flex justify-center flex-col items-center gap-10">
              <img
                src="/images/success.png"
                alt="logo_success"
                className="w-20 h-auto"
              />
              {/* <div className="flex flex-col justify-end text-3xl text-center text-5xl">
              Payment Successful 
            </div> */}

              <h2 className="text-center text-3xl">Payment Successful</h2>

              <button
                onClick={popup}
                className="rounded-full pt-2 pb-4 px-6 text-2xl border-gray-200 font-semibold"
                style={{ borderColor: "rgba(1,1,1,0.16)" }}
              >
                See Summary{" "}
                <img className="relative top-2 pl-2" src="/images/arrow.png" />
              </button>

              {/* <h2 className="text-4xl">{order.itemsPrice} €</h2>

              <div
                className="flex flex-col justify-center items-center w-full py-8 px-6 rounded-2xl"
                style={{ backgroundColor: "#FFFDF1" }}
              >
                <div className="flex justify-between w-full">
                  <p>Order ID :</p>
                  <p> &nbsp; {order._id} </p>
                </div>
                <div className="flex justify-between w-full">
                  <p>Date :</p>
                  <p>
                    {" "}
                    &nbsp; {order.updatedAt.substring(8, 10)}/
                    {order.updatedAt.substring(5, 7)}{" "}
                  </p>
                </div>

                <div className="flex justify-between w-full">
                  <p>Hour :</p>
                  <p>
                    {" "}
                    &nbsp; {parseInt(order.updatedAt.substring(11, 13)) + 1}:
                    {order.updatedAt.substring(14, 16)}{" "}
                  </p>
                </div>
              </div> */}

              <div className="flex flex-col  items-center justify-center p-8 my-8 invoiceScan">
                <img src={QrCode} alt="qrcode" className="w-80 h-80" />
              </div>

              <p
                className="text-center px-20"
                style={{ fontFamily: "intermedium" }}
              >
                To complete you shopping use the QR code near the exit of the
                store
              </p>

              <Rating
                data={{ orderId: order._id, axiosInstance: axiosInstance }}
              />

              <Link to="/scan" className="w-full">
                <div className="pikko-btn rounded-full mt-8 mb-40 py-6 justify-self-end pikko-btn w-full text-center text-black">
                  Back to home
                </div>
              </Link>
            </div>

            {/******************* */}
            <div
              id="orderPopup"
              style={{ visibility: "hidden" }}
              className="absolute min-w-full min-h-full left-0 top-0 h-full overflow-auto"
            >
              <div id="" className=" bg-white flex flex-col p-8 ">
                <div className="flex justify-center flex-col items-center ">
                  <div className="flex justify-between w-full">
                    <button className="border-none" onClick={popup}>
                      <img
                        src="/images/cross.png"
                        alt="close"
                        className="h-8"
                      />
                    </button>
                    {Invoice(orderDetails, store)}
                  </div>

                  <img
                    src="/images/success.png"
                    alt="logo_success"
                    className="w-12 mb-3 h-auto"
                  />

                  <h2 className="text-center text-2xl">Payment Successful</h2>

                  <h2 className="text-4xl mt-5">{order.itemsPrice} €</h2>
                  <img
                    className="relative top-6"
                    src="/images/invoice_cart.png"
                  />
                  <div
                    className="flex flex-col justify-center items-center w-full py-8 px-6 pt-10 rounded-2xl"
                    style={{ backgroundColor: "#FFFDF1" }}
                  >
                    <h3 className="text-3xl font-medium mb-8">
                      {store.name}
                    </h3>
                    <div className="flex justify-between w-full">
                      <p>ID :</p>
                      <p className="font-semibold"> &nbsp; {order._id} </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>Date :</p>
                      <p className="font-semibold">
                        {" "}
                        &nbsp; {order.updatedAt.substring(8, 10)}/
                        {order.updatedAt.substring(5, 7)}{" "}
                      </p>
                    </div>

                    <div className="flex justify-between w-full">
                      <p>Hour :</p>
                      <p className="font-semibold">
                        {" "}
                        &nbsp; {parseInt(order.updatedAt.substring(11, 13)) + 1}
                        :{order.updatedAt.substring(14, 16)}{" "}
                      </p>
                    </div>

                    <div className="flex justify-between w-full">
                      <p>Total amount :</p>
                      <p className="font-semibold">{order.itemsPrice} €</p>
                    </div>
                  </div>

                  <div className="flex flex-col  items-center justify-center p-6 my-8 invoiceScan">
                    <img src={QrCode} alt="qrcode" className="w-64 h-64" />
                  </div>

                  <p className="text-center px-12 mb-8">
                    To complete you shopping use the QR code near the exit of
                    the store
                  </p>

                  <button
                    className="pikko-btn rounded-full mt-8 mb-40 py-6 justify-self-end pikko-btn w-full text-center text-black relative"
                  >
                    Save the ticket
                    <div className="bottom-0 left-0 py-6 absolute w-full opacity-0 saveTicket">
                      {" "}
                      {Invoice(orderDetails, store)}{" "}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {iscom ? (
              <>
                <div className="px-12 mb-10">
                  <div
                    className="bg-white py-10 px-12 justify-center items-center flex flex-col gap-6 rounded-3xl"
                    style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                  >
                    <div
                      style={{ fontFamily: "latoregular" }}
                      className="text-3xl"
                    >
                      Merci Beaucoup !
                    </div>
                    <div
                      style={{ fontFamily: "Nunito", color: "#666666" }}
                      className="text-2xl text-center"
                    >
                      Ton précieux avis va nous aider à améliorer l'application
                      !
                    </div>
                    {/* <div className="">
              <img src="/images/valid_com.png" alt="validé" className='h-auto w-20'/>
            </div> */}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* <div className='px-12 '>
        <div className="flex flex-col text-center items-center bg-white py-10 gap-6 rounded-3xl" 
          style={{fontFamily:'poppinssemibold', boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"}}>
            <div className="text-3xl">
              Donne-nous ton avis !
            </div>   
            <div className="">
              <textarea  className='border-none rounded-xl px-6 py-4 text-center text-xl' placeholder="Ton avis compte, aide-nous à améliorer l'application !" 
              onInput={getData} name="commentaire" style={{height: "100px", width: "250px", background: "rgba(245, 237, 254, 0.5)", fontFamily: "poppinssemibold"}}/>
            </div>      
        </div>    
        <div className='flex justify-center mt-10'>
          <button className='border-none bg-black text-white px-14 py-4 rounded-lg' type="button" disabled={com === "" || iscom} onClick={comSubmit}>Envoyer</button>               
        </div>
      </div>
       */}
              </>
            )}
          </div>

          {/* <div className="flex-1 flex flex-col items-center justify-end pt-14 gap-10 rounded-tr-3xl rounded-tl-3xl px-16 pb-40" style={{background: "linear-gradient(96.63deg, #FF627F 13.87%, #FFBA88 87.26%), #000000"}}>
          {}
            <div className="text-5xl text-white text-center flex flex-col" style={{fontFamily:'poppinssemibold', lineHeight: "45px"}}>
              <span>
                Montre ton QR
              </span>
              <span>
                code à un vendeur
              </span>
            </div>    
            <div className='flex justify-between w-full text-white'>
              <span className='flex'>
                <span style={{fontFamily:'poppinssemibold'}}>
                  Order ID :
                </span>
                <span>
                  &nbsp;{order._id} 
                </span>             
              </span>  
              <span>
                <span style={{fontFamily:'poppinssemibold'}}>
                  Date :
                </span>
                <span>
                  &nbsp; {order.updatedAt.substring(8,10)}/{order.updatedAt.substring(5,7)} {parseInt(order.updatedAt.substring(11,13))+1}:{order.updatedAt.substring(14,16)}
                </span>
              </span>
            </div>       
            {}
              <div className='flex flex-col bg-white items-center justify-center' style={{width: "230px", height: "250px", borderTopRightRadius: "90px", borderTopLeftRadius:"90px"}}>
                {}
                <img  src={QrCode} alt="qrcode" className='w-60 h-60'/>  
              </div> 
           
        </div>                    */}
        </div>
      ) : (
        <>
          <div class="loader loader-default is-active"></div>
        </>
      )}
    </>
  );
};
export default OrderSuccess;
