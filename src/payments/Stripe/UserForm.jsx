import React, { useEffect, useState } from "react";
import useAxiosInterceptors from "../../axios/useAxios";

const UserForm = ({ formDone, openStatus }) => {
  const axiosInstance = useAxiosInterceptors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isFormComplete, setIsFormComplete] = useState();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //console.log("ussser")
  //console.log(user)

  useEffect(() => {
    console.log("ussser")
    console.log(user)
    if(user && user.name && user.email){
      setName(user.name)
      setEmail(user.email)
      //console.log("complete !!!")
      //setIsFormComplete(true)
      //setIsContentVisible(true)
    }
    
  }, []);

  useEffect(() => {
    setIsFormComplete(false)
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
    if(isFormComplete){

      localStorage.setItem("user", `{"name":"${name}", "email":"${email}"}`);
    }
    if (isFormComplete) {
      /*setTimeout(() => {
        setIsContentVisible(false);
      }, "500");*/
      
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

  function createCustomers() {
      axiosInstance.post("/stripe/customer", {
      name: name,
      email: email,
    });
  }


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
            //value={name}
            value={user && user.name ? user.name : name}
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
            value={user && user.name ? user.email : email}
            //value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />     

       

        <button className="mt-12" onClick={createCustomers}>valider</button>
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
