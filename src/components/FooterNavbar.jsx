import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import CartLength from "./cartLength";
import CartLength from "./CartLength";

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
  const countItems = CartLength()

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
                {countItems}
              </span>
            }

            <img
              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter%2Ffooter_cart.png?alt=media&token=f39655c9-ad7c-4df5-830e-b7e4871d068e"
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
            src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter%2Ffooter_scan.png?alt=media&token=bed667f4-c922-4a44-8edb-c736d397a2eb"
            alt="scan"
            className="h-16 w-auto relative"
          />
        </div>
        {/* <div className='text-black'>scan</div> */}
      </Link>

      <Link to="/account">
        <div className={isActive.account ? "active p-3" : "p-3"}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Ffooter%2Ffooter_account.png?alt=media&token=d178796b-2a6c-4e6f-b726-98aafce3c7b0"
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
