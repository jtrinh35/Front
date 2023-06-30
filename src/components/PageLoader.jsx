import React from "react";

const PageLoader = () => {
  return (
    <>
      <div
        className=" z-50 flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#fffdf1" }}
      >
        <div className="x-reset-container">
          <div className="c-leaf">
            <svg
              className="c-leaf__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="310"
              height="266"
              viewBox="0 0 300 256"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M300 0H0V256H300V0ZM66.0605 129.353C66.0605 129.353 135.513 124.603 135.986 199.149C61.31 198.676 66.0605 129.353 66.0605 129.353ZM148.786 56C148.786 56 201.268 101.657 148.786 154.708C96.3264 101.657 148.786 56 148.786 56ZM233.467 129.353C233.467 129.353 164.026 124.603 163.542 199.149C238.228 198.676 233.467 129.353 233.467 129.353Z"
                fill="#fffdf1"
              />
            </svg>

            <div className="c-leaf__fill"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLoader;
