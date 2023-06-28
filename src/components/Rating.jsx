import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { comOrder } from "../actions/orderActions";

const Rating = (data) => {
  ({ data } = data);
  const { loading, success } = useSelector((state) => state.orderCom);
  const orderCom = useSelector((state) => state.orderCom);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(localStorage.getItem("rating"));
  const { store } = useSelector((state) => state.store);
  const comment = async (com) => {
    const orderId = data.orderId;
    const axiosInstance = data.axiosInstance;
    await dispatch(comOrder(orderId, com, axiosInstance));
    setRating(localStorage.getItem("rating"));
  };
  console.log("--rating");
  console.log(rating);

  const close = () => {
    var element = document.getElementById("rate");
    if (element.style.visibility === "hidden") {
      element.style.visibility = "visible";
    } else {
      element.style.visibility = "hidden";
    }
  };

  const rated = () => {
    localStorage.setItem("rating", true);
    setRating(localStorage.getItem("rating"));
    close();
  };

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <div>
          {rating ? (
            <></>
          ) : (
            <div
              id="rate"
              className="absolute min-w-full min-h-full flex justify-center items-center bottom-32 left-0 "
            >
              <div
                className=" bg-white flex flex-col items-center px-8 pt-6 pb-10 rounded-3xl w-5/6"
                style={{ boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)" }}
              >
                <button className="border-none self-start" onClick={close}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fpopup_cross.png?alt=media&token=85ef2558-f156-4bb2-ae74-00d3493ada5c"
                    alt="close"
                    className="h-8"
                  />
                </button>

                <div className=" flex flex-col items-center px-8">
                  <h2 className="text-center mb-4">
                    How was your experience ?
                  </h2>
                  <p className="text-center mb-8">
                    Please give us your feedback on Google
                  </p>

                  <div className="flex gap-8">
                    {/* <button
                      className="border-none flex flex-col items-center gap-3"
                      onClick={() => comment("Poor")}
                    >
                      <img src="/images/poor.png" />
                      Poor
                    </button>
                    <button
                      className="border-none flex flex-col items-center gap-3"
                      onClick={() => comment("Average")}
                    >
                      <img src="/images/average.png" />
                      Average
                    </button>
                    <button
                      className="border-none flex flex-col items-center gap-3"
                      onClick={() => comment("Good")}
                    >
                      <img src="/images/good.png" />
                      Good
                    </button>
                    <button
                      className="border-none flex flex-col items-center gap-3"
                      onClick={() => comment("Excellent")}
                    >
                      <img src="/images/excellent.png" />
                      Excellent
                    </button> */}
                  </div>
                </div>
                <a
                  onClick={rated}
                  className=""
                  href={store.avis_google}
                  target="_blank"
                >
                  <div
                    className="flex gap-1 items-center justify-between rounded-[10px] border-solid border-slate-300"
                    style={{ borderWidth: "0.5px" }}
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Frating_google_logo.png?alt=media&token=a6225fd4-ec9f-454c-95ca-430f2157b0b1"
                      className="w-24 h-auto p-4"
                    ></img>
                    <div className=" bg-blue-500 p-4 rounded-r-[10px] self-stretch flex items-center">
                      <p className="text-white">
                        Click here to leave us {"\n \n"} a review on Google!
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Rating;
