import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterNavbar from "../components/FooterNavbar";
const AccountScreen = () => {
  return (
    <>
      <div className="bg-white h-screen w-screen flex flex-col justify-center items-center p-10">
        <img
          className="w-24"
          src="/images/Logo_Pineapple.png"
          alt="logo"
        />
        <h1 className="text-5xl mt-4">En construction</h1>
        <p className="mt-4 mb-20">À venir...</p>
      </div>
      <FooterNavbar props={{ account: true }} />
    </>
  );
};

export default AccountScreen;
