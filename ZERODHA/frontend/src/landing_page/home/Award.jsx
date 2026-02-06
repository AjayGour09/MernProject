import React from "react";

const Award = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center gy-4">
        {/* Image */}
        <div className="col-12 col-md-6 text-center">
          <img
            src="media/images/largestBroker.svg"
            alt="Largest Broker"
            className="img-fluid"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {/* Text Content */}
        <div className="col-12 col-md-6">
          <h2 className="mb-3">Largest stock broker in India</h2>
          <p className="mb-4 text-muted">
            2+ million Zerodha clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>

          <div className="row">
            <div className="col-6 mb-3">
              <ul className="list-unstyled">
                <li>Futures and options</li>
                <li>Commodity derivatives</li>
                <li>Currency derivatives</li>
              </ul>
            </div>
            <div className="col-6 mb-3">
              <ul className="list-unstyled">
                <li>Stocks & IPOs</li>
                <li>Direct mutual funds</li>
                <li>Bond & Govt. securities</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-md-start mt-4">
            <img
              src="media/images/pressLogos.png"
              alt="Press Logos"
              className="img-fluid"
              style={{ maxWidth: "80%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Award;
