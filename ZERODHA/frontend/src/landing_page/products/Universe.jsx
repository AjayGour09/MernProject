import React from "react";

const Universe = () => {
  const universeData = [
    {
      img: "media/images/zerodhaFundhouse.png",
      title: "Zerodha Fundhouse",
      desc: "Our asset management venture creating simple and transparent index funds to help you save for your goals.",
    },
    {
      img: "media/images/sensibullLogo.svg",
      title: "Sensibull",
      desc: "Options trading platform to create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.",
    },
    {
      img: "media/images/goldenpiLogo.png",
      title: "GoldenPi",
      desc: "Investment research platform offering detailed insights on stocks, sectors, supply chains, and more.",
    },
    {
      img: "media/images/streakLogo.png",
      title: "Streak",
      desc: "Systematic trading platform to create and backtest strategies without coding.",
    },
    {
      img: "media/images/smallcaseLogo.png",
      title: "Smallcase",
      desc: "Thematic investing platform that helps you invest in diversified baskets of stocks on ETFs.",
    },
    {
      img: "media/images/dittoLogo.png",
      title: "Ditto",
      desc: "Personalized advice on life and health insurance. No spam and no mis-selling. Sign up for free.",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mt-5">The Zerodha Universe</h2>
      <p className="text-center mb-5">
        Extend your trading and investment experience even further with our partner platforms
      </p>

      <div className="row g-4">
        {universeData.map((item, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-12 text-center">
            <img
              src={item.img}
              alt={item.title}
              className="mb-3"
              style={{ width: "80%", maxWidth: "300px" }}
            />
            <p className="text-muted" style={{ fontSize: "14px" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button className="btn btn-primary px-4 py-2">Sign Up For Free</button>
      </div>
    </div>
  );
};

export default Universe;
