import React from "react";

const Hero = () => {
  return (
    <div>
      <h2 className="text-center mt-5">Charges</h2>
      <h4 className="text-center text-muted mt-3">List of all charges and taxes</h4>
      <div className="d-flex  align-content-center justify-content-center p-5 gap-5" style={{marginTop:"80px", marginLeft:"30px"}}>
        <div>
          <img src="media/images/pricing0.svg"  alt="" className="" style={{width:"250px"}} />
          <h2>Free equity delivery</h2>
          <p className="text-muted">
            All equity delivery investments (NSE, BSE), are absolutely free — ₹
            0 brokerage.
          </p>
        </div>
        <div>
          <img src="media/images/intradayTrades.svg" alt="" style={{width:"250px"}}/>
          <h2>Intraday and F&O trades</h2>
          <p>
            Flat ₹ 20 or 0.03% (whichever is lower) per  executed order on <br />
            intraday trades across equity, currency, and commodity trades. Flat
            ₹20 on all option trades
          </p>
        </div>
        <div>
          <img src="media/images/pricing0.svg" alt="" style={{width:"250px"}}/>
          <h2>Free equity delivery</h2>
          <p>
            All direct mutual fund investments are absolutely free — ₹ 0
            commissions & DP charges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
