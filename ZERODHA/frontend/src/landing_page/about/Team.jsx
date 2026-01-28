import React from "react";

const Team = () => {
  return (
    <div className="container">
      <h2 className="text-center mt-5">People</h2>
      <div className="d-flex align-items-center justify-content-center gap-5">
        <div className="mt-5">
          <img src="media/images/nithinKamath.jpg" alt="" className="p-2" style={{width:"280px",borderRadius:"50%"}}/>
          <p className="text-center fs-5">Nithin Kamath</p>
          <p className="text-center text-muted">Founder, CEO</p>
        </div>
        <div className=" ">
          <p className="font-text">
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the <br />
            hurdles he faced during his decade long stint as a trader. Today,<br />
            Zerodha has changed the landscape of the Indian broking industry.
          </p>
          <p className="font-text">
            He is a member of the SEBI Secondary Market Advisory Committee <br />
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p className="font-text">Playing basketball is his zen.</p>
          <p>Connect on <span className="text-primary hover-text cursor-pointer">Homepage</span> / <span className="text-primary hover-text cursor-pointer"> TradingQnA </span> / <span className="text-primary hover-text cursor-pointer"> Twitter</span></p>
        </div>
      </div>
    </div>
  );
};

export default Team;
