import React from "react";
import { GoArrowRight } from "react-icons/go";

const Education = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center gy-4">
        {/* Image */}
        <div className="col-12 col-md-6 text-center">
          <img
            src="media/images/education.svg"
            alt="Education"
            className="img-fluid"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {/* Text Content */}
        <div className="col-12 col-md-6">
          <h2 className="fs-3 mb-4">Free and open market education</h2>

          <p className="mb-2">
            Varsity, the largest online stock market education book in the world,
            covering everything from the basics to advanced trading.
          </p>
          <div className="mb-3">
            <a href="#" className="text-decoration-none text-primary">
              Varsity <GoArrowRight />
            </a>
          </div>

          <p className="mb-2">
            TradingQ&A, the most active trading and investment community in India
            for all your market-related queries.
          </p>
          <div>
            <a href="#" className="text-decoration-none text-primary">
              TradingQ&A <GoArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
