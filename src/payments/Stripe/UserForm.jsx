import React, { useEffect, useState } from "react";

const UserForm = ({ formDone, openStatus }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (name != "" && emailRegex.test(email)) {
      setTimeout(() => {
        setIsFormComplete(true);
      }, "400");
      //setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [name, email]);

  useEffect(() => {
    formDone(isFormComplete);
    if (isFormComplete) {
      setTimeout(() => {
        setIsContentVisible(false);
      }, "500");
      
    }
  }, [isFormComplete]);

  useEffect(() => {
    if (!isFormComplete && openStatus) {
      setIsContentVisible(openStatus);
    }else if(!openStatus){
      setIsContentVisible(openStatus);
    }
  }, [openStatus]);

  const handleToggleSlide = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between rounded-[10px] bg-white text-black py-5 w-auto h-20 border-solid border-[0.5px] border-slate-300 px-8 w-full flex-wrap mt-12 ${
          isContentVisible ? "slide-down-btn" : ""
        }`}
        onClick={handleToggleSlide}
      >
        <span className="text-2xl"> Coordonnées utilisateur </span>
        <div className={`nav-arrow-r ${isContentVisible ? "rotate-90" : ""}`}>
          <img src="/images/nav-arrow-right.svg" />
        </div>
      </div>

      <div
        id="userForm"
        className={`flex flex-col justify-start gap-5 h-fit py-8 w-full px-8 mb-12 rounded-[10px] border-solid border-[0.5px] border-slate-300 px-8 w-full ${
          isContentVisible ? "slide-down-content visible" : "slide-down-content"
        } ${openStatus ? "slide-down-transition" : ""}`}
      >
        <div className="w-full">
          <p>
            <label className="text-lg" htmlFor="name">
              Name:
            </label>
          </p>

          <input
            className=" rounded-[10px] border-solid border-[0.5px] border-slate-300 w-full px-4"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="">
          <p>
            <label className="text-lg" htmlFor="email">
              Email Address:
            </label>
          </p>
          <input
            className="rounded-[10px] border-solid border-[0.5px] border-slate-300 w-full px-4"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {isFormComplete ? (
          <>
            <div className="flex justify-end mt-4">
              <img className="h-8" src="/images/check-circle.svg" />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default UserForm;
