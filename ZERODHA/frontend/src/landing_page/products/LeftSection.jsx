import React from "react";
import { FaAppStore, FaArrowRightLong } from "react-icons/fa6";

const LeftSection = ({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  aapStore,
}) => {
  return (
    <div className="container p-2">
      <div className="row mt-2">
        <div className="col-6 mt-5">
          <img
            src={imageURL}
            alt=""
            className="mt-5"
            style={{ marginLeft: "80px" }}
          />
        </div>
        <div className="col-6 mt-5 p-5" style={{}}>
          <h2 className="mt-5 ms-5 text-muted fs-2">{productName}</h2>
          <p className="ms-5 font-text">{productDescription}</p>
          <div className="d-flex gap-5 ms-5 font-text">
            {tryDemo && (
              <p className="text-primary hover-text cursor-pointer">
                {tryDemo} <FaArrowRightLong />
              </p>
            )}

            {learnMore && (
              <p className="text-primary hover-text cursor-pointer">
                {learnMore} <FaArrowRightLong />
              </p>
            )}
          </div>

          <div className="d-flex gap-4 mt-3 ms-5">
            <img src={googlePlay} alt="" />
            <img src={aapStore} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
