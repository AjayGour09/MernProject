import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const RightSection = ({
  imageURL,
  productName,
  productDescription,
  learnMore,
  learnMoreLink
}) => {

  const openLearnMore = () => {
    if (learnMoreLink) {
      window.open(learnMoreLink, "_blank");
    }
  };

  return (
    <section className="container py-5">
      <div className="row align-items-center">

        {/* Text Section */}
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">

          <h2 className="fw-semibold mb-3">
            {productName}
          </h2>

          <p
            className="text-muted"
            style={{ lineHeight: "1.8", maxWidth: "500px" }}
          >
            {productDescription}
          </p>

          {learnMore && (
            <div
              className="text-primary fw-semibold mt-3"
              style={{ cursor: "pointer" }}
              onClick={openLearnMore}
            >
              {learnMore} <FaArrowRightLong />
            </div>
          )}

        </div>

        {/* Image Section */}
        <div className="col-lg-6 col-md-12 text-center">

          <img
            src={imageURL}
            alt={productName}
            style={{
              width: "90%",
              maxWidth: "420px",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

        </div>

      </div>
    </section>
  );
};

export default RightSection;