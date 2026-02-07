import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="container py-5 text-center">
      {/* Heading & Description */}
      <h2 className="fs-3 mb-3">Unbeatable Pricing</h2>
      <p className="text-muted mb-4">
        We pioneered the concept of discount broking and price transparency in India.
        Flat fees and no hidden charges.
      </p>
      <Link to="/pricing" className="text-decoration-none text-primary mb-5 d-inline-block">
        See Pricing <GoArrowRight />
      </Link>

      {/* Pricing Cards */}
      <div className="row justify-content-center mt-4 gy-3">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="border rounded p-4 h-100">
            <h2 className="mb-3">₹0</h2>
            <p className="text-muted mb-0">
              Free equity delivery and direct mutual funds
            </p>
          </div>
        </div>
        <div className="col-12 col-md-5 col-lg-4">
          <div className="border rounded p-4 h-100">
            <h2 className="mb-3">₹20</h2>
            <p className="text-muted mb-0">
              Intraday and F&O trades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
