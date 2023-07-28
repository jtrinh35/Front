import React, { useEffect, useState } from "react";
import useEdenredInterceptors from "../../axios/edenredAxios/useEdenredAxios";

const Edenred = () => {
  "lucasismael@yopmail.com";
  "Edenred2021*";
  "5543";

  const redirect_uri = "http://localhost:3000/cart";
  const url = `https://sso.sbx.edenred.io/connect/authorize?response_type=code&client_id=427b16d007b048c5b7416ec28cf69e37&scope=openid%20edg-xp-mealdelivery-api%20offline_access&redirect_uri=${redirect_uri}&state=abc123&nonce=456azerty&acr_values=tenant%3Afr-ctrtku&ui_locales=fr`;
  const open = () => {
    window.open(url, "_blank");
  };
  const [edenred, setEdenred] = useState();
  const edenredInstance = useEdenredInterceptors()

  const handleLocalStorageChange = (event) => {
    if (event.key === "Edenred") {
      setEdenred(JSON.parse(localStorage.getItem("Edenred")));
      console.log("La clé ma_cle_a_suivre a été mise à jour !");
    }
  };

  useEffect(() => {
    window.addEventListener("storage", handleLocalStorageChange);

    // Nettoyage de l'écouteur d'événement lorsque le composant est démonté
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("Edenred")) {
      setEdenred(JSON.parse(localStorage.getItem("Edenred")));
      //console.log("edenRed in local")
    } else {
      setEdenred(false);
    }
  }, []);

  function parseBalance(amount) {
    const parsedAmout = (amount / 100).toFixed(2).replace(".", ",");
    return parsedAmout;
  }

  const deletePopup = () => {
    let element = document.getElementById("deleteEden");
    if (element.style.visibility === "hidden") {
      element.style.visibility = "visible";
    } else {
      element.style.visibility = "hidden";
    }
  };

  function removeEdenred(){
    edenredInstance.post('/edenred/delete', {
      access_token: JSON.parse(localStorage.getItem('Edenred')).access_token
    })

    localStorage.removeItem("Edenred")

    setEdenred(false)
  }


  //console.log("local storage : ")
  //let eden = JSON.parse(localStorage.getItem('Edenred'))
  /*eden.balance.amount*/
  //console.log(parseBalance(eden.balance.amount))

  return (
  
    <>
      {edenred && edenred.balance && edenred.balance.amount ? (
        <>
          <button className="edenred-btn flex justify-evenly items-center font-medium bg-slate-50 text-black py-5 w-auto  rounded-full edenred-btn-active"
          onClick={deletePopup}>
            Edenred
            <span className=" text-lg font-semibold bg-red-100  p-1 px-2 rounded-[5px] text-red-600 ">
              <span className="font-bold">
                {parseBalance(edenred.balance.amount)}
              </span>{" "}
              € max{" "}
            </span>
            <img
              className=" h-10"
              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2FEdenred-Logo.png?alt=media&token=48042cb0-3bea-4bb5-948d-4e629a1ae046"
            />
          </button>

          <div
            id="deleteEden"
            className="absolute min-w-full min-h-full left-0 top-0 h-full overflow-auto flex justify-center items-center"
            style={{ visibility: "hidden" }}
          >
            <div
              className=" bg-white w-3/4 flex flex-col gap-10 p-8 rounded-[12px]"
              style={{
                boxShadow: "0 0 0 100vmax rgb(0 0 0 / 65%)",
              }}
            >
              <div className="flex justify-center flex-col gap-10 items-center ">
                <p className="text-2xl text-center font-bold mt-4">
                  Voulez-vous supprimer ce moyen de paiement ?
                </p>
              </div>

              <div className="flex items-center justify-around">
                <button
                  className="text-2xl py-2 px-4 rounded-[5px] border-none bg-[#e5e5e5]"
                    onClick={deletePopup}
                >
                  Annuler
                </button>
                <button
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                  }}
                  className="text-2xl py-2 border-none  px-4 rounded-[5px] text-white  "
                  onClick={()=>{
                    deletePopup()
                    removeEdenred()
                  }}
                >
                  supprimer
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            className="edenred-btn flex justify-center items-center font-semibold bg-white text-black py-5 w-auto  rounded-full"
            onClick={open}
          >
            Edenred
            <img
              className="ml-4 h-8"
              src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Fcart%2FEdenred-Logo.png?alt=media&token=48042cb0-3bea-4bb5-948d-4e629a1ae046"
            />
          </button>
        </>
      )}
    </>
  );
};

export default Edenred;
