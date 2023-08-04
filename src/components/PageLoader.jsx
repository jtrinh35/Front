import React from "react";

const PageLoader = () => {
  return (
    <>
      <div
        className=" z-50 flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#fffdf1" }}
      >
        <div className="pageLoader"></div>
      </div>
    </>
  );
};

export default PageLoader;
