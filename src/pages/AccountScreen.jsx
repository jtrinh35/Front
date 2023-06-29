import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterNavbar from "../components/FooterNavbar";
import HomeLoader from "../components/HomeLoader";
const AccountScreen = () => {
  return (
    <>
      <HomeLoader />
      {/* <div className="bg-white h-screen w-screen flex flex-col justify-center items-center p-10">
        <img
          className="w-24"
          src="https://firebasestorage.googleapis.com/v0/b/pikkopay.appspot.com/o/Webapp%2Flogo_pikkopay.png?alt=media&token=14350d62-7ef9-45bd-b8ee-5cac376b0a53"
          alt="logo"
        />
        <h1 className="text-5xl mt-4">En construction</h1>
        <p className="mt-4 mb-20">À venir...</p>
      </div>
      <FooterNavbar props={{ account: true }} /> */}
    </>
  );
};

export default AccountScreen;
