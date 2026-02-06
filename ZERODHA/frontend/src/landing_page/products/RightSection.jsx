import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const RightSection = ({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        {/* Text Section */}
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <h2 className="fs-2 mb-3">{productName}</h2>
          <p className="font-text">{productDescription}</p>

          {learnMore && (
            <p className="text-primary hover-text cursor-pointer">
              {learnMore} <FaArrowRightLong />
            </p>
          )}
        </div>

        {/* Image Section */}
        <div className="col-lg-6 col-md-12 text-center">
          <img
            src={imageURL}
            alt={productName}
            style={{ width: "90%", maxWidth: "400px" }}
          />
        </div>

      </div>
    </div>
  );
};

export default RightSection;
