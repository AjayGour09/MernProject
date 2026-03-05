import React from "react";

const Universe = () => {
  const universeData = [
    {
      img: "media/images/zerodhaFundhouse.png",
      title: "Zerodha Fundhouse",
      desc: "Our asset management venture creating simple and transparent index funds to help you save for your goals.",
      link: "https://www.zerodhafundhouse.com/",
    },
    {
      img: "media/images/sensibullLogo.svg",
      title: "Sensibull",
      desc: "Options trading platform to create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.",
      link: "https://sensibull.com/",
    },
    {
      img: "media/images/goldenpiLogo.png",
      title: "GoldenPi",
      desc: "Investment research platform offering detailed insights on stocks, sectors, supply chains, and more.",
      link: "https://goldenpi.com/",
    },
    {
      img: "media/images/streakLogo.png",
      title: "Streak",
      desc: "Systematic trading platform to create and backtest strategies without coding.",
      link: "https://streak.tech/",
    },
    {
      img: "media/images/smallcaseLogo.png",
      title: "Smallcase",
      desc: "Thematic investing platform that helps you invest in diversified baskets of stocks on ETFs.",
      link: "https://www.smallcase.com/",
    },
    {
      img: "media/images/dittoLogo.png",
      title: "Ditto",
      desc: "Personalized advice on life and health insurance. No spam and no mis-selling. Sign up for free.",
      link: "https://joinditto.in/",
    },
  ];

  const openLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-semibold text-dark">The Zerodha Universe</h2>
        <p className="text-muted mb-0" style={{ maxWidth: 820, margin: "0 auto" }}>
          Extend your trading and investment experience even further with our partner platforms.
        </p>
      </div>

      {/* Cards */}
      <div className="row g-4">
        {universeData.map((item, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-12">
            <div
              className="p-4 rounded-4 border bg-white h-100 shadow-sm"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => openLink(item.link)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "";
              }}
              role="button"
              tabIndex={0}
            >
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: 70 }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ maxWidth: "180px", width: "70%", objectFit: "contain" }}
                />
              </div>

              <div className="text-center">
                <h6 className="fw-semibold mb-2">{item.title}</h6>
                <p className="text-muted mb-0" style={{ fontSize: 14, lineHeight: 1.7 }}>
                  {item.desc}
                </p>

                <div className="mt-3">
                  <span className="text-primary fw-semibold">
                    Visit →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-5">
        <button className="btn btn-primary px-4 py-2 rounded-3 shadow-sm">
          Sign Up For Free
        </button>
      </div>
    </section>
  );
};

export default Universe;