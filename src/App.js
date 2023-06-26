import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'


const CartScreen = React.lazy(() => import('./pages/CartScreen'));
const ProductScreen = React.lazy(() => import('./pages/ProductScreen'));
const Scan = React.lazy(() => import('./components/Scan'));
const OrderScreen = React.lazy(() => import('./pages/OrderScreen'));
const OrderCheck = React.lazy(() => import('./pages/OrderCheck'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));
const PreScanScreen = React.lazy(() => import('./pages/PreScanScren'));
const RedirectPage = React.lazy(() => import('./pages/RedirectPage'))
const ScanCheck = React.lazy(() => import('./pages/ScanCheck'))



function App() {
  // const location = useLocation();

  // console.log('hash', location.hash);
  window.scrollTo(0, 0);

  return (
    <BrowserRouter>
      <div className = "home">
          <main>
            <React.Suspense fallback={<div className="loader loader-default is-active"></div>}>
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