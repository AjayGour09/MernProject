import React from "react";
import { GoArrowRight } from "react-icons/go";
const Pricing = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="row">
        <div className="col-4">
          <h1 className="fs-3 mb-4">Unbeatable pricing</h1>
          <p className="text-muted">
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <div>
            <a href="#" className="text-decoration-none">
              See Pricing <GoArrowRight />
            </a>
          </div>
        </div>
        <div className="col-2"></div>
        <div className="col-6 d-flex gap-1">
          <div className="border p-4" style={{width:"38%"}}>
            <h2 className="d-flex justify-content-center">₹0</h2>
            <p className="d-flex align-items-center mt-3 text-muted">Free equity delivery and &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; direct mutual funds</p>
          </div>
          <div className="border p-4" style={{width:"38%"}}>
            <h2 className="d-flex justify-content-center">₹20</h2>
            <p className="d-flex align-items-center mt-3 ms-4 text-muted">intraday and F&Q</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
