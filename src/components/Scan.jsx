import React, { useEffect, useState } from "react";
import Quagga from "quagga";
import Config from "../axios/Config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../actions/cartActions";
import { toast } from "react-toastify";
import { listProducts } from "../actions/productActions";
import Header from "./Header";
import { createOrder } from "../actions/orderActions";
import { ORDER_DETAILS_RESET } from "../constants/orderConstants";
import * as ScanditSDK from "scandit-sdk";
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

const Scan = () => {
  window.scrollTo(0, 0);

  const navigate = useNavigate();
  const { order } = useSelector((state) => state.orderCreate.order) || {};
  const orderDetails = useSelector((state) => state.orderDetails.order);
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

  let findProduct;

  const refreshScan = () => {
    // setProduct()
    setAccess(true);
    setCode(0);
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
        <div >
          <ScanditBarcodeScanner
            licenseKey={process.env.REACT_APP_SCANDIT_KEY}
            engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build"
            preloadBlurryRecognition={true}
            preloadEngine={true}
            accessCamera={true}
            guiStyle={BarcodePicker.GuiStyle.VIEWFINDER}
            viewFinderArea={{ x: 0.2, y: 0.01, width: 0.6, height: 0.1 }}
            onScan={(scanResult) => {
              setCode(scanResult.barcodes[0].data);
              console.log(scanResult.barcodes[0].data);
            }}
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
    if (product) {
      dispatch(addToCart(order._id, product, qty, axiosInstance));
    }
    setLoading(false);
    setProduct(false);

    const element = document.getElementById('footer-cart');
    const rect = element.getBoundingClientRect();
    console.log("offseeeet")
    console.log(rect);

    const dot = document.getElementById('cart-item');
    const dot_offset = dot.getBoundingClientRect();
    console.log("offset dot")
    console.log(dot_offset)
    
  };

  async function getProduct() {
    if (Code) {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/products/${order.storeId}/${Code}`
        );
        console.log(data);
        setProduct(data[0]);
        setLoading(false);
        setAccess(false);
        setQty(1);
        setTimeout(refreshScan, scanTimer);
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
    getProduct();
  }, [Code]);

  useEffect(() => {
    if (product) {
      // addToCartHandler()
      // setCode()
    }
  }, [product]);

  const productPopup = () => {
    if(product){
        setProduct(false)
    }
  }

  useEffect(() => {
    if (orderDetails && orderDetails.isPaid) {
      if (store && store.id) {
        navigate(`/?ok=${store.id}`);
      } else {
        navigate("/");
      }
    }
  }, [orderDetails, orderCreate]);

  return (
  
    <div className={overflowStyle} id="scan-main" >
   
      <div className="scan-screen  ">
        {loading ? (
          <>
            <div className="loader loader-default is-active"></div>
          </>
        ) : (
          <>  
              
               {localStorage.getItem("scanner") ? <>      <Header />  {scan()}     
               <div className="absolute w-full h-fit text-center m-auto top-2/4">
                  <div className="flex justify-center " id="information">
                    <p className="information_text text-lg h-screen w-screen"  onClick={productPopup}>Scan the barcode of your products</p>     
                  </div>
                 
                </div>
                <span className="cart-item" id="cart-item"></span>
            { <FooterNavbar props={{scan:true}}/>}

            </> : <><div id="scan" className="w-screen relative flex flex-col justify-start items-center" >
              <div className="brand_scan bg-black z-20  relative py-8 flex justify-center items-center">
              <img id="brand" className="w-10" src="/images/Logo_Pineapple.png" alt="logo" />
                <img id="brand" className="w-40" src="https://i.ibb.co/LR2v5bR/Pikko-1.png" alt="logo" />
              </div>

            <div className=" brand_overlay absolute opacity-60 z-10 w-full bg-black opactiy-75" > </div>
             <Header /> 
              

              <div className="scan-overlay rounded-t-[25px] w-screen px-4 bg-white n"  onClick={() => deployScan()}>
                <div className="container flex flex-col items-center justify-start px-8 text-center mx-auto">

                  <img id="brand" className="my-16 w-96" src="/images/scan_pic.png" alt="" />

                  <h1 className="mt-4 mb-8">Get Started With PikkoPay</h1>


                  <h5 className="my-6">Skip the line, just scan, pay & Go!</h5>

                  <p className="text-center">
                    Scan products you want to buy at your favourite store and
                    pay by your phone, no queues & enjoy happy, friendly
                    Shopping!
                  </p>

                  <button
                    className="rounded-full mt-14 mb-12 py-8 justify-self-end pikko-btn w-full"
                    onClick={() => deployScan()}
                  >
                    Let's go
                  </button>
                  {/* {localStorage.getItem("scanner") ? <>{scan()}</> : <></>} */}

                  {/* {scan()} */}
                </div>
              </div>
            </div></>} 


            
              {/* {localStorage.getItem("scanner") ? <>{scan()}</> : <></>} */}

            {product ? (
              <>
                <div
                  className="fixed bottom-0 z-20 w-screen"
                
                >

                  
                  {/* <div className="relative top-24 right-10">
                    <img src="images/valid_mail.png" alt="valid" />
                  </div>
                  <div className="text-center mb-4 relative left-8">
                    <span
                      style={{
                        color: "#85DE9D",
                        fontFamily: "poppinssemibold",
                        fontSize: "13px",
                      }}
                    >
                      Le produit a été ajouté à ton panier
                    </span>
                  </div> */}
                  <div
                    id="popup_product"
                    className="bg-white py-4 px-8 flex flex-col justify-evenly items-center rounded-t-[16px] "
                  
                  >
                    <div className="dashed flex justify-center items-center w-full pb-8"> 
                    <div className="popupimage">
                      <img src={product.image} className="h-24"></img>
                    </div>
                    <div className="popupdescription py-4 ml-4  ">
                      <div className="min-30 text-left Break Words  ">
                        <p className='mb-1 w-60 text-2xl text-black' >{product.name}</p>
                        <p className='text-2xl text-black'><strong> {product.price}€ </strong></p>
                      </div>
                      {/* <div
                        className="min-30_price !text-black"
                        style={{
                          fontFamily: "poetsen_oneregular",
                          fontSize: "25px",
                        }}
                      >
                        {product.price}€
                      </div> */}
                    </div>
                    {qty < 2 ? (
                      <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                     
                      {qty}
                      <button className='top-1 border-none pl-4 relative top-px relative plusBtn' onClick={() => incQty()}>+</button>
                      </div>
                    ) : (
                      
                      <>
                      
                      <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">
                        <button className="border-none pr-4 relative minusBtn" onClick={() => decQty()}>-</button>
                        {qty}
                      <button className='top-1 border-none pl-4 relative top-px relative plusBtn' onClick={() => incQty()}>+</button>
                      </div>
                      
                      </>
                    )}
                    </div>

                    <div className="flex w-full">
                      <button className="rounded-full mt-5 mb-4 py-6 justify-self-end pikko-btn w-full" onClick={() => addToCartHandler()}>Add to cart</button>
                    </div>

                    {/* <div className="min-30_price rounded-full border-solid px-6 py-1 flex items-center text-2xl relative">{qty}
                    <button className='top-1 border-none pl-4 relative top-px' onClick={() => incQty()}>+</button>
                    </div> */}
                    {/* <button onClick={() => addToCartHandler()}>ADD</button> */}
                    
                  </div>
                </div>

               
              </>
            ) : (
              <>
                <div className="bordures_scan" id="bordures_scan"></div>
                <div
                  className="justify-center"
                  style={{
                    height: "100vh",
                    height: "-webkit-calc(100vh - 65px)",
                    height: "-moz-calc(100vh - 65px)",
                    height: "calc(100vh  - 65px)",
                    display:"none"
                  
                  }}
                >
                  <div className="absolute w-full text-center m-auto top-2/4">
                    {/* <div className="flex justify-center" id="information" onClick={info}> */}
                    <div className="flex justify-center" id="information">
                      {/* <img src="/images/formule.png" alt="info" id="information_img"/> */}
                       <span className="information_text">Scan the barcode of your products</span> 
                    </div>
                    {/* <div className='w-full flex justify-center'>
                                <div id="formule" className='w-9/12 rounded-3xl py-2 text-white' style={{visibility: "hidden"}}>
                                    <div>
                                        <img src="/images/barcode-white.png" alt="barcode" className="mx-auto h-16 w-auto"/>
                                    </div>
                                    <div className="text-3xl break-words pb-2" style={{fontFamily:"poppinssemibold"}}>Scanne le code barre</div>
                                    <div className="text-2xl break-words pb-4" style={{fontFamily:"poppinsregular"}}>de tes produits</div>
                                </div>
                            </div> */}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Scan;
