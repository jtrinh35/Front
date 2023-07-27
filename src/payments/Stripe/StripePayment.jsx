import React, { useEffect } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Stripe = () => {

    const stripe = loadStripe(
        'pk_test_51K7i0KDpRgB6XXl9RyZSm0SOAorrK3qP3LN47vKGjVnNsbDG5Mc46c8UGPW9QuW2tPIWex1QN7Ox5ITLHHlnDibZ00nQpru6sm'
        );
      // const stripe = loadStripe(
      //   'pk_live_51K7i0KDpRgB6XXl9Z0XcWHCsCVMLlmUZjRaOAPCWww5hU6UlVIrCi9uZuHyDMbTHdEXbb8KYr5SY6Bo16gEgUaLo00v8GKEJ5d'
      //   );

    return (
        <div >
            <>
                {<Elements stripe={stripe} >
                    <CheckoutForm/>
                </Elements>}
            </>
        </div>
    );
};

export default Stripe;