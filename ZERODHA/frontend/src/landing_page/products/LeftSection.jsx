import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const LeftSection = ({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* LEFT IMAGE */}
        <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="col-md-6">
          <h2 className="fs-2 fw-bold text-muted mb-3">{productName}</h2>
          <p className="font-text mb-4">{productDescription}</p>

          <div className="d-flex flex-wrap gap-3 mb-4">
            {tryDemo && (
              <span className="text-primary hover-text cursor-pointer d-flex align-items-center gap-1">
                {tryDemo} <FaArrowRightLong />
              </span>
            )}

            {learnMore && (
              <span className="text-primary hover-text cursor-pointer d-flex align-items-center gap-1">
                {learnMore} <FaArrowRightLong />
              </span>
            )}
          </div>

          <div className="d-flex gap-3">
            {googlePlay && <img src={googlePlay} alt="Google Play Store" />}
            {appStore && <img src={appStore} alt="Apple App Store" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
