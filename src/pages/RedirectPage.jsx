import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { idActions } from "../actions/idActions";
import { createOrder } from "../actions/orderActions";
import Config from "../axios/Config";
import {
  ORDER_CREATE_RESET,
  ORDER_DETAILS_RESET,
} from "../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import { CART_EMPTY } from "../constants/cartConstants";
import { ID_RESET } from "../constants/idConstants";
import { getStore } from "../actions/storeActions";
import { STORE_RESET } from "../constants/storeConstants";
import useAxiosInterceptors from "../axios/useAxios";
import HomeLoader from "../components/HomeLoader";

const RedirectPage = () => {
  // if get store success alors GO
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
  const id = useSelector((state) => state.id);
  const { store } = useSelector((state) => state.store);
  const { success, loading, order } = useSelector((state) => state.orderCreate);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const dispatch = useDispatch();
  console.log(axiosInstance);

  const location = new URLSearchParams(window.location.search).get("ok");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    setTimeout(() => {
      setIsPageLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    window.localStorage.clear();
    dispatch({ type: CART_EMPTY });
    dispatch({ type: ID_RESET });
    dispatch({ type: ORDER_DETAILS_RESET });
    dispatch({ type: ORDER_CREATE_RESET });
    dispatch({ type: STORE_RESET });
    setReset(true);
  }, []);

  useEffect(() => {
    // if(order){
    //     dispatch(getClient(order.order.clientId, axiosInstance))
    //     dispatch(listMenus(axiosInstance))
    // }
    console.log("location useEffect");
    dispatch(getStore(location, axiosInstance));
    axiosInstance.post("/track/visit", { storeId: location });
  }, [location]);

  useEffect(() => {
    console.log("order useEffect");
    if (store && reset) {
      const orderCreate = { storeId: store.id, clientId: "" };
      console.log("new order stooore");
      try {
        dispatch(createOrder(orderCreate, axiosInstance));
      } catch (e) {
        console.log(e);
      }
    }
  }, [store]);

  console.log("--------order-------");
  console.log(order);
  return (
    /*<>
      {isLoading ? (
        <HomeLoader />
      ) : (*/
        <>
          {success && !isLoading ? (
            <>
            {//isPageLoading ? <><HomeLoader/></> : 
            <div> {navigate("/scan")} </div>
            }
            </>
          ) : (
            <>
             
              {location ? (
                <> <HomeLoader /></>
              ) : (
                <>
               
                <HomeLoader />
                <div className="absolute z-50 mt-52 left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4">
                  <p className="text-2xl font-bold">Scannez un QR code</p>
                </div>
                {/* <div
                  id="loader"
                  class="loader loader-default is-active"
                  data-text="Scannez un QR code"
                ></div>  */}
                </>
              )}
            </>
          )}
        </>
      //)}
    //</>

    /////
    /*<>
      {success ? (
        <div> {navigate("/scan")} </div>
      ) : (
        <>
          <div id="loader" class="loader loader-default is-active"></div>

          {location ? (
            <>
              <div id="loader" class="loader loader-default is-active"></div>
            </>
          ) : (
            <div
              id="loader"
              class="loader loader-default is-active"
              data-text="Scannez un QR code"
            ></div>
          )}
        </>
      )}
    </>*/

    //////////////////////////

    // <>
    // {loading ? (
    //     <>
    //     <div id="loader" class="loader loader-default is-active"></div>

    //     </>
    // ) : (

    //         <>
    //             {success ?

    //                 <>

    //                     <div>
    //                     {navigate('/scan')}
    //                     </div>

    //                     </>
    //                 :(
    //                     <>
    //                     {location ? (
    //                         <>
    //                         {/* <div id="loader" class="loader loader-default is-active"></div> */}
    //                         <div>{navigate('/scan')}</div>
    //                         </>
    //                     ) : (
    //                         <>
    //                         <div id="loader" class="loader loader-default is-active" data-text="Scannez un QR code"></div>
    //                         </>

    //                     )}

    //                     </>
    //                 )}
    //         </>

    //     )}

    // </>
  );
};

export default RedirectPage;

// <div id="loader" class="loader loader-default is-active" data-text="Scannez un QR code"></div>
