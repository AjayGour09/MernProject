import React from "react";

const Universe = () => {
  return (
    <div >
      <h2 className="text-center mt-5">The Zerodha Universe</h2>

      <p className="text-center ">
        Extend your trading and investment experience even further with our
        partner platforms
      </p>
      <div className="d-flex justify-content-center gap-5  w-75" style={{marginLeft:"160px",marginTop:"90px"}}>
        <div className="p-2">
          <img
            src="media/images/zerodhaFundhouse.png"
            alt=""
            style={{ width: "300px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Our asset management venture that is creating <br /> simple and
            transparent index funds to help you <br /> save for your goals.
          </p>
        </div>
        <div className="p-2">
          <img
            src="media/images/sensibullLogo.svg"
            alt=""
            style={{ width: "300px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Options trading platform that lets you create strategies <br /> analyze
            positions, and examine data points like open <br /> interest, FII/DII, and
            more.
          </p>
        </div>
        <div className="p-2">
          <img
            src="media/images/goldenpiLogo.png"
            alt=""
            style={{ width: "300px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Investment research platform that offers <br /> detailed insights on
            stocks, sectors, <br /> supply chains, and more.
          </p>
        </div>
      </div>
     <div className="d-flex justify-content-around w-75"  style={{marginLeft:"160px",marginTop:"1px"}}>
        <div className="p-5">
          <img
            src="media/images/streakLogo.png"
            alt=""
            style={{ width: "300px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Systematic trading platform that allows <br /> you to create and backtest
            strategies without coding.
          </p>
        </div>
        <div className="p-5">
          <img
            src="media/images/smallcaseLogo.png"
            alt=""
            style={{ width: "300px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Thematic investing platform that helps <br /> you invest in diversified
            baskets of stocks on ETFs.
          </p>
        </div>
        <div className="p-5">
          <img
            src="media/images/dittoLogo.png"
            alt=""
            style={{ width: "220px" }}
          />
          <p className="text-muted mt-2 p-2" style={{ fontSize: "12px" }}>
            Personalized advice on life and health insurance.  No spam and no
            mis-selling. Sign up for free
          </p>
        </div>
      </div>
      <div className="text-center"><button className="btn btn-primary p-2">SignUp For Free</button></div>
    </div>
  );
};

export default Universe;
