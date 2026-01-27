import React from "react";
import { GoArrowRight } from "react-icons/go";
const Education = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src="media/images/education.svg" alt="" />
        </div>
        <div className="col-6 mt-5">
          <h2 className="mt-5 mb-4 fs-3">Free and open market education</h2>
          <p>
            Varsity, the largest online stock market education book in the world
            covering  <br />everything from the basics to advanced trading.
          </p>
          <div className="mb-3 ">
            <a href="true" className="text-decoration-none">
              Varsity <GoArrowRight />
            </a>
          </div>

          <p>
            TradingQ&A, the most active trading and investment community in <br />
            India for all your market related queries.
          </p>
          <div>
            <a href="true" className="text-decoration-none">
             TradingQ&A <GoArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
