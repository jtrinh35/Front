import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import {Provider} from 'react-redux'
import './styles/index.css'
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
import { AuthProvider } from './context/authProvider';
// import { AuthProvider } from './context/authProvider';

// import {Elements} from '@stripe/react-stripe-js'
// import {loadStripe} from '@stripe/stripe-js'


//   const stripe = loadStripe(
//   'pk_test_51K7i0KDpRgB6XXl9RyZSm0SOAorrK3qP3LN47vKGjVnNsbDG5Mc46c8UGPW9QuW2tPIWex1QN7Ox5ITLHHlnDibZ00nQpru6sm'
//   );

ReactDOM.render(
  <AuthProvider>
    <Provider store ={store}>
      {/* <Elements stripe = {stripe}> */}
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
      {/* </Elements> */}
    </Provider>
    </AuthProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
