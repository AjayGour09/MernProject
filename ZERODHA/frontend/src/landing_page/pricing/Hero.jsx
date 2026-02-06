import React from "react";

const ChargesHero = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mt-5">Charges</h2>
      <h4 className="text-center text-muted mt-3">
        List of all charges and taxes
      </h4>

      <div className="row mt-5 g-4 justify-content-center">
        {/* CARD 1 */}
        <div className="col-12 col-md-4 text-center">
          <img
            src="media/images/pricing0.svg"
            alt="Free equity delivery"
            className="img-fluid mb-3"
            style={{ maxWidth: "250px" }}
          />
          <h4>Free equity delivery</h4>
          <p className="text-muted">
            All equity delivery investments (NSE, BSE) are absolutely free — ₹0
            brokerage.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="col-12 col-md-4 text-center">
          <img
            src="media/images/intradayTrades.svg"
            alt="Intraday and F&O trades"
            className="img-fluid mb-3"
            style={{ maxWidth: "250px" }}
          />
          <h4>Intraday and F&O trades</h4>
          <p className="text-muted">
            Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday
            trades across equity, currency, and commodity. Flat ₹20 on all option
            trades.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="col-12 col-md-4 text-center">
          <img
            src="media/images/pricing0.svg"
            alt="Direct mutual funds"
            className="img-fluid mb-3"
            style={{ maxWidth: "250px" }}
          />
          <h4>Direct mutual funds</h4>
          <p className="text-muted">
            All direct mutual fund investments are absolutely free — ₹0
            commissions & DP charges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChargesHero;
