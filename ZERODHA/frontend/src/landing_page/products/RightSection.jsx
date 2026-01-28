import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const RightSection = ({
  imageURL,
  productName,
  productDescription,
}) => {
  return (
    <div className="container p-5">
      <div className="row mt-5 p-5">
        <div className="col-6 " style={{ marginTop: "250px" }}>
          <h2 className="ms-5 fs-2">{productName}</h2>
          <p className="ms-5 font-text">
           {productDescription}
          </p>
          <p className="text-primary hover-text cursor-pointer ms-5">
            Learn more <FaArrowRightLong />
          </p>
        </div>
        <div className="col-6">
          <img src={imageURL} alt="" className="me-5" />
        </div>
      </div>
    </div>
  );
};

export default RightSection;
