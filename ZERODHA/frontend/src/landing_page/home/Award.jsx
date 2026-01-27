import React from "react";

const Award = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src="media/images/largestBroker.svg" alt="Largest Broker" />
        </div>
        <div className="col-6 mt-5">
          <h1 >Largest stock broker in india</h1>
          <p className="mb-3 mt-2">
            2+ million Zerodha clients contributes to over 15% of all retail
            order volumes in india daily by trading and investing in
          </p>
          <div className="row">
            <div className="col-6 p-3">
              <ul>
                <li>
                  <p>Futures and options </p>
                </li>
                <li>
                  <p>Commodity derivatives</p>
                </li>
                <li>
                  <p>Currency derivatives</p>
                </li>
              </ul>
            </div>
            <div className="col-6 p-3">
              <ul>
                <li>
                  <p>Stocks & IPOs</p>
                </li>
                <li>
                  <p>Direct mutual funds</p>
                </li>
                <li>
                  <p>Bond & Govt. securites</p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <img src="media/images/pressLogos.png" alt="" className="w-50 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Award;
