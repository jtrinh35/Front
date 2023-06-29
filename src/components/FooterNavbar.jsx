import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const FooterNavbar = (props) => {
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.orderDetails) || null;
  const cart = useSelector((state) => state.cart);
  const [isActive, setIsActive] = useState({
    scan: false,
    cart: false,
    account: false,
    ...props.props,
  });

  const cartLength = () => {
    let length;
    console.log(length);
    order && order.orderItems.length > 0 ? (length = order.orderItems.map((product) => product.Qty).reduce((a, b) => a + b)) : cart && cart.cartItems.length > 0 ? (length = cart.cartItems.map((product) => product.Qty).reduce((a, b) => a + b)): (length = 0);
    console.log(cart);

    console.log(length);

    return length;
  };

  return (
    <footer className="bottom-0 rounded-t-[25px] bg-white flex justify-around items-center px-8 text-center text-black">
      <Link to="/cart">
        <div id="footer-cart">
          <div className={isActive.cart ? "active p-3" : "p-3"}>
            {
              <span
                id="footerCart"
                className="px-2 py-1 absolute top-4 ml-8 bg-red-500 rounded-full text-white"
              >
                {cartLength()}
              </span>
            }

            <img
              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter_cart.png?alt=media&token=0de5a235-b4ba-46cb-9951-fd6788feb289"
              alt="panier"
              className="h-10 w-auto"
            />
          </div>
        </div>
        {/* <div className='text-black'>panier</div> */}
      </Link>

      <Link
        to="/scan"
        className="scanBtn bg-white w-32 h-32 relative flex justify-center items-center rounded-t-[100%] left-0"
      >
        <div className={isActive.scan ? "active p-6" : "p-6"}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter_scan.png?alt=media&token=b4c7ebbe-8909-4c79-8aaf-c2d91b880548"
            alt="scan"
            className="h-16 w-auto relative"
          />
        </div>
        {/* <div className='text-black'>scan</div> */}
      </Link>

      <Link to="/account">
        <div className={isActive.account ? "active p-3" : "p-3"}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter_account.png?alt=media&token=70d5b3a3-2a6b-4950-a00b-483cfcc29beb"
            alt="cagnotte"
            className="h-10 w-auto"
          />
          {/* <div className='text-black'>cagnotte</div> */}
        </div>
      </Link>
    </footer>
  );
};

export default FooterNavbar;
