import React, { useEffect, useState, useRef } from "react";
import Quagga from "quagga";
import Config from "../axios/Config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addToCart, getCartInfo } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../actions/cartActions";
import { toast } from "react-toastify";
import { listProducts } from "../actions/productActions";
import Header from "./Header";
import HomeLoader from "./HomeLoader";
import { createOrder, detailsOrder } from "../actions/orderActions";
import { ORDER_DETAILS_RESET } from "../constants/orderConstants";
import * as ScanditSDK from "scandit-sdk";
import Scanner from "./Scanner";
import CartLength from "./CartLength";
import {
  Barcode,
  BarcodePicker,
  Camera,
  CameraAccess,
  CameraSettings,
  ScanResult,
  ScanSettings,
  SingleImageModeSettings,
} from "scandit-sdk";
import ScanditBarcodeScanner from "scandit-sdk-react";
import useAxiosInterceptors from "../axios/useAxios";
import FooterNavbar from "./FooterNavbar";
//import { ToastInternet } from "./Toast";
import PageLoader from "../components/PageLoader";

const Scan = () => {
  window.scrollTo(0, 0);
  console.log("hfeizjfizeojfopezof")
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.orderCreate.order) || {};
  const orderCreate = useSelector((state) => state.orderCreate);
  const { store } = useSelector((state) => state.store);
  const scanTimer = 1000;

  // const axiosInstance = Config()
  const axiosInstance = useAxiosInterceptors();
  const dispatch = useDispatch();
  const [access, setAccess] = useState(true);
  const [scanner, setScanner] = useState(false);
  const [Code, setCode] = useState();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
 
  const [qty, setQty] = useState(1);
  const [overflowStyle, setOverflowStyle] = useState("overflow-auto h-full");
  //const [isOnline, setIsOnline] = useState(navigator.onLine);
  //const prevOnlineStatus = useRef(isOnline);
  const cart = useSelector((state) => state.cart);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isProductAnimOver, setisProductAnimOver] = useState(false);

  const countItems = CartLength();
  const [isPaused, setIsPaused] = useState(countItems >= 5 ? true : false);
  const [cartFullPopup, setCartFullPopup] = useState(false);

  const animProductRef = useRef(null);

  useEffect(() => {
    if (order) {
      console.log("-----cart change");
      dispatch(getCartInfo(order._id, axiosInstance));
    }
  }, []);

  useEffect(() => {
    if (countItems >= 5) {
      setIsPaused(true);
      setCartFullPopup(true);
    } else {
      setIsPaused(false);
      setCartFullPopup(false);
    }
  }, [countItems]);

  const refreshScan = () => {
    // setProduct()
    setAccess(true);
  };
  const getScanSettings = () => {
    return new ScanditSDK.ScanSettings({
      enabledSymbologies: ["ean8", "ean13", "upca", "code128"],
      codeDuplicateFilter: 2500,
      searchArea: { x: 0.025, y: 0.1, width: 0.95, height: 0.36 },
      maxNumberOfCodesPerFrame: 1,
    });
  };

  const incQty = () => {
    setQty(qty + 1);
  };
  const decQty = () => {
    setQty(qty - 1);
  };

  const deployScan = () => {
    localStorage.setItem("scanner", true);
    setScanner(true);
    setOverflowStyle("overflow-hidden");
  };

  const scan = () => {
    if (access) {
      return (
        <div>
          <Scanner
            preloadBlurryRecognition={true}
            preloadEngine={true}
            accessCamera={true}
            guiStyle={BarcodePicker.GuiStyle.VIEWFINDER}
            viewFinderArea={{ x: 0.2, y: 0.01, width: 0.6, height: 0.1 }}
            onScan={(scanResult) => {
              setCode(scanResult.barcodes[0].data);
              //scanResult.rejectCode(scanResult.barcodes[0]);
              console.log(scanResult.barcodes[0].data);
            }}
            pause={isPaused}
            onProcessFramze
            scanSettings={getScanSettings()}
            videoFit={BarcodePicker.ObjectFit.COVER}
            playSoundOnScan={true}
            enableCameraSwitcher={false}
            enablePinchToZoom={false}
            enableTapToFocus={true}
            enableTorchToggle={false}
            mirrorImage={true}
          />
        </div>
      );
    } else {
      return <div>{console.log("scan off")}</div>;
    }
  };

  /*function renewOrder(id, visitorId) {
    const order = { storeId: id, clientId: visitorId };
    dispatch(createOrder(order, axiosInstance));
    dispatch({ type: ORDER_DETAILS_RESET });
  }*/
  function formule_popup() {
    var formule = document.getElementById("formule");
    formule.classList.toggle("active");
  }

  const addToCartHandler = () => {
    // const footerCart = document.getElementById("footerCart");
    setLoading(false);
    if (countItems == 4){
      console.log("y'en a 4")
      setIsPaused(true);
    }

    addToCartAnim();

    // setIsNavbarHidden(true);
    // getProductOffset();
    // setTimeout(() => {
    // setProduct(false);
    // footerCart.classList.add("shake");
    // if (product) {
    //     dispatch(addToCart(order._id, product, qty, axiosInstance));
    //     setCode(0);

    //   }
    // }, "750");
    // footerCart.classList.remove("shake");

    /*const dot = document.getElementById('cart-item');
    const dot_offset = dot.getBoundingClientRect();
    console.log("offset dot")
    console.log(dot_offset)*/
  };

  async function addToCartAnim() {
    //setIsPaused(true);
    console.log("debut anim cart");
    const footerCart = document.getElementById("footerCart");

    footerCart.classList.remove("shake");
    setIsNavbarHidden(true);
    getProductOffset();
    /*if (product) {
      await dispatch(addToCart(order._id, product, qty, axiosInstance));
      setCode(0);
      
    }
    setProduct(false);*/

    setTimeout(() => {
      if (product) {
        dispatch(addToCart(order._id, product, qty, axiosInstance));
        setCode(0);
      }
      setProduct(false);
      footerCart.classList.add("shake");
    }, "750");

    footerCart.classList.remove("shake");
    console.log("fin anim cart");
    //setIsPaused(false);
  }

  const getProductOffset = () => {
    if (product) {
      const element = document.getElementById("product_img");
      const offset = element.getBoundingClientRect();
      console.log("offseeeet");
      console.log(offset);

      const animProduct = animProductRef.current;
      // Set the position of the div based on offset values
      animProduct.style.top = `${offset.top}px`;
      animProduct.style.left = `${offset.left}px`;
      const footerCart = document.getElementById("footer-cart");
      const cartOffset = footerCart.getBoundingClientRect();
      console.log(cartOffset);

      console.log("------offset difference----");
      let translateXValue = 0;
      offset.left - cartOffset.left > 10
        ? (translateXValue = -(offset.left - cartOffset.left))
        : (translateXValue = 0);
      console.log(offset.left - cartOffset.left);

      animProduct.style.setProperty("--translate-x", `${translateXValue}px`);
    }
  };

  async function getProduct() {
    if (Code) {
      try {
        //setIsPaused(true)
        //alert("hello");
        setLoading(true);
        setIsNavbarHidden(false);
        const { data } = await axiosInstance.get(
          `/products/${order.storeId}/${Code}`, {
            params: {
              orderId: order._id
            } }
        );
       

        console.log(data);
        setProduct(data[0]);
        setLoading(false);
        //setIsPaused(false)
        // setAccess(false);
        setQty(1);
        setTimeout(refreshScan, scanTimer);
        getProductOffset();
      } catch (err) {
        console.log(err);
        setLoading(false);
        setCode();
        alert("Article non trouvé, réessayez !");
        setAccess(true);
      }
    }
  }

  useEffect(() => {
    if (loading) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order]);

  useEffect(() => {
    getProduct();
  }, [Code]);

  useEffect(() => {
    if (product) {
      // addToCartHandler()
      // setCode()
    }
  }, [product]);

  const productPopup = () => {
    if (product) {
      setProduct(false);
      setCode(0);
    }
  };

  useEffect(() => {
    if (cart && cart.cartItems.isPaid) {
      if (store && store.id) {
        navigate(`/?ok=${store.id}`);
      } else {
        navigate("/");
      }
    }
  }, [cart, orderCreate]);

  const navbarOut = () => {
    setIsNavbarHidden(true);
  };



  return (
    <>
    {order ?(
      <>
        <div className={overflowStyle} id="scan-main">
          <div className="min-h-full min-w-full bg-black text-white ">
            {/* {loading ? (
              <>
              
                 <div className="loader loader-default is-active"></div>  
              </>
            ) : (  */}
            <>
              {localStorage.getItem("scanner") ? (
                <>
                  <Header />
                  {loading ? (
                    <>
                      <div
                        className="absolute z-50 h-screen w-screen "
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <div className="z-50 absolute left-2/4 top-[25%]  -translate-x-2/4 ">
                          <div class="lds-spinner white">
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
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {scan()}
                  <div className="absolute w-full h-fit text-center m-auto top-2/4">
                    <div className="flex justify-center" id="">
                      <p
                        className="text-lg h-screen w-screen"
                        onClick={productPopup}
                      >
                        Scannez le code-barres de vos produits
                      </p>
                    </div>
                  </div>

                  {cartFullPopup ? (
                    <>
                      <div
                        id="cartFullPopup"
                        className="absolute min-w-full min-h-full left-0 top-0 h-full overflow-auto flex justify-center items-center"
                      >
                        <div
                          id=""
                          className=" bg-white w-3/4 flex flex-col gap-8 p-8 rounded-[12px]"
                          style={{
                            boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)",
                          }}
                        >
                          <div className="flex justify-center flex-col gap-10 items-center ">
                            <p className="text-2xl text-center font-bold mt-4 text-black">
                              Votre panier est plein, supprimez des articles
                              pour continuer à scanner.
                            </p>
                          </div>

                          <button className="pikko-btn rounded-full mt-4 py-6 justify-self-end pikko-btn w-full text-center text-black relative">
                            <Link className="text-2xl text-black" to="/cart">
                              Se rendre dans le panier
                            </Link>
                          </button>

                          <div className="flex items-center justify-around"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {<FooterNavbar props={{ scan: true }} />}
                </>
              ) : (
                <>
                  <div className="w-screen relative flex flex-col justify-start items-center">
                    <div className="bg-black z-20 relative py-8 flex justify-center items-center">
                      <img
                        className="w-10 h-auto"
                        src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Flogo_pikkopay.png?alt=media&token=14350d62-7ef9-45bd-b8ee-5cac376b0a53"
                        alt="logo"
                      />
                      <img
                        className="w-40 h-auto"
                        src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Flogo_pikkopay_font.png?alt=media&token=439c8def-dc0a-4f54-a35a-7d9173f68534"
                        alt="logo"
                      />
                    </div>

                    <div className="brand_overlay absolute opacity-60 z-10 w-full bg-black opactiy-75">
                      {" "}
                    </div>
                    <Header />

                    <div
                      className="scan-overlay text-black rounded-t-[25px] w-screen px-4 bg-white n"
                      onClick={() => deployScan()}
                    >
                      <div className="container flex flex-col items-center justify-start px-8 text-center mx-auto">
                        <img
                          className="my-16 w-96"
                          src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fscan%2Fscan_overlay_pic.png?alt=media&token=485d7bc9-eded-481d-afb3-991817453327"
                          alt=""
                        />

                        <h1 className="mt-4 mb-8">Bienvenue sur Pikkopay </h1>

                        <h5 className="my-6">
                          Scannez, payez et partez !
                          {/* Skip the line, just scan, pay & Go! */}
                        </h5>

                        <p className="text-center">
                          {/* Scan products you want to buy at your favourite
                          store and pay by your phone, no queues & enjoy
                          happy, friendly Shopping! */}
                          Scannez vos produits et payez depuis votre
                          téléphone. Évitez la file d'attente et profitez d'un
                          shopping simple et agréable !
                        </p>

                        <button
                          className="rounded-full mt-14 mb-12 py-8 justify-self-end pikko-btn w-full"
                          onClick={() => deployScan()}
                        >
                          C'est parti !
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {product ? (
                <>
                  <div className="fixed bottom-0 z-20 w-screen">
                    <div
                      ref={animProductRef}
                      style={{ "--translate-x": 0 }}
                      className={`footer-navbar  ${
                        isNavbarHidden
                          ? "cart-item cart-item-anim visible"
                          : "hidden"
                      }
                        rounded-full bg-white w-28 h-28 flex items-center justify-center"
                        }`}
                    >
                      <div className="absolute inset-x-2/4 inset-y-2/4   -translate-y-2/4 -translate-x-2/4  flex items-center justify-center w-24 h-24">
                        <img
                          src={product.image}
                          className="max-w-full max-h-full p-2 rounded-full"
                          alt=""
                        />
                      </div>
                    </div>

                    <div
                      id="popup_product"
                      className={`footer-navbar ${
                        isNavbarHidden
                          ? "slide-down bg-white py-4 px-8 flex flex-col justify-evenly items-center rounded-t-[16px]"
                          : "bg-white py-4 px-8 flex flex-col justify-evenly items-center rounded-t-[16px]"
                      }`}
                    >
                      <div className="dashed flex justify-center items-center w-full pb-8">
                        <div className="flex justify-center items-center">
                          <img
                            id="product_img"
                            src={product.image}
                            className="w-24 h-auto"
                          ></img>
                        </div>
                        <div className="h-full flex flex-col justify-center items-center py-4 ml-4  ">
                          <div className="min-30 text-left">
                            <p className="mb-1 w-60 text-2xl text-black">
                              {product.name}
                            </p>
                            <p className="text-2xl text-black">
                              <strong> {product.price}€ </strong>
                            </p>
                          </div>
                        </div>
                        {console.log("hfehfiozejfoeiz ++" + qty)}
                        {qty < 2 && countItems + qty < store.item_limit ? (
                          <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                            {qty}
                            <button
                              className="top-1 border-none pl-4 relative top-px relative plusBtn"
                              onClick={() => incQty()}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <>
                            {console.log("999999999999")}
                            <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                              {qty >= 2 ? (
                                <button
                                  className="border-none pr-4 relative minusBtn"
                                  onClick={() => decQty()}
                                >
                                  -
                                </button>
                              ) : (
                                <></>
                              )}
                              {qty}
                              {console.log("------------" + countItems + qty)}
                              {countItems + qty >= store.item_limit ? (
                                <></>
                              ) : (
                                <button
                                  className="top-1 border-none pl-4 relative top-px relative plusBtn"
                                  onClick={() => incQty()}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex w-full">
                        <button
                          className="rounded-full mt-5 mb-4 py-6 justify-self-end pikko-btn w-full"
                          onClick={() => addToCartHandler()}
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
            {/* )}  */}
          </div>
        </div>
      </>
    ) : (
      <></>
    )}
  </>
  );
};

export default Scan;
