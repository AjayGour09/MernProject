import React from "react";

const Team = () => {
  return (
    <div className="container">
      <h2 className="text-center my-5">People</h2>

      <div className="row align-items-center gy-4">
        {/* Image Section */}
        <div className="col-12 col-md-4 text-center">
          <img
            src="media/images/nithinKamath.jpg"
            alt="Nithin Kamath"
            className="img-fluid rounded-circle p-2"
            style={{ maxWidth: "280px" }}
          />
          <p className="fs-5 mt-3 mb-0">Nithin Kamath</p>
          <p className="text-muted">Founder, CEO</p>
        </div>

        {/* Text Section */}
        <div className="col-12 col-md-8">
          <p className="font-text">
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            Zerodha has changed the landscape of the Indian broking industry.
          </p>

          <p className="font-text">
            He is a member of the SEBI Secondary Market Advisory Committee (SMAC)
            and the Market Data Advisory Committee (MDAC).
          </p>

          <p className="font-text">Playing basketball is his zen.</p>

          <p>
            Connect on{" "}
            <span className="text-primary hover-text cursor-pointer">
              Homepage
            </span>{" "}
            /{" "}
            <span className="text-primary hover-text cursor-pointer">
              TradingQnA
            </span>{" "}
            /{" "}
            <span className="text-primary hover-text cursor-pointer">
              Twitter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;
