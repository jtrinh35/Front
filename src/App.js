import React, { useContext, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import AccountScreen from './pages/AccountScreen';
import Scan from "./components/Scan";
import  PageLoader from './components/PageLoader';
import CartScreen from './pages/CartScreen';
import { ToastInternet } from "./components/Toast";
import { toast } from "react-toastify";


//const CartScreen = React.lazy(() => import('./pages/CartScreen'));
const ProductScreen = React.lazy(() => import('./pages/ProductScreen'));
//const Scan = React.lazy(() => import('./components/Scan'));
const OrderScreen = React.lazy(() => import('./pages/OrderScreen'));
const OrderCheck = React.lazy(() => import('./pages/OrderCheck'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));
const PreScanScreen = React.lazy(() => import('./pages/PreScanScren'));
const RedirectPage = React.lazy(() => import('./pages/RedirectPage'))
const ScanCheck = React.lazy(() => import('./pages/ScanCheck'))
// const HomeLoader = React.lazy(() => import('./components/HomeLoader'))


function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const prevOnlineStatus = useRef(isOnline);

    useEffect(() => {
    const handleOnline = () => {
      if (!prevOnlineStatus.current) {
        toast.dismiss();
        ToastInternet("internet", "connexion rétablie");
        setTimeout(() => {
          toast.dismiss();
        }, 2000);
      }
      setIsOnline(true);
      prevOnlineStatus.current = true;
    };

    const handleOffline = () => {
      setIsOnline(false);
      prevOnlineStatus.current = false;
      ToastInternet("noInternet", "Aucune connexion internet");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  // const location = useLocation();

  // console.log('hash', location.hash);
  window.scrollTo(0, 0);

  return (
    <BrowserRouter>
      <div className = "home">
          <main>
            {/* <React.Suspense fallback={<div className="loader loader-default is-active"></div>}>  */}
            
            <React.Suspense fallback={<PageLoader/>}> 
            <Routes>
              <Route path = '/' element ={<RedirectPage/>}></Route>
              <Route path = '/pre' element ={<PreScanScreen/>}></Route>
              <Route path = '/scan' element = {<Scan/>}></Route>
              <Route path = '/product/:id' element ={<ProductScreen/>}></Route>
              <Route path = '/cart' element ={<CartScreen/>}></Route>            
              <Route path = '/check/:orderId' element = {<OrderCheck/>}></Route>
              <Route path = '/ordersuccess/:orderId' element = {<OrderSuccess/>}></Route>
              <Route path = '/order/:orderId' element = {<OrderScreen/>}></Route>
              <Route path = '/ScanCheck' element = {<ScanCheck/>}></Route>
              <Route path = '/account' element = {<AccountScreen/>}></Route>
              
            </Routes> 
            </React.Suspense>
          </main>
      </div>
    </BrowserRouter>
  );
}
// git remote set-url origin https://github.com/lysot/Jilsfront.g
// npm install --legacy-peer-deps 
export default App;