import React from "react";

const ChargesHero = () => {
  const cards = [
    {
      img: "media/images/pricing0.svg",
      alt: "Free equity delivery",
      title: "Free equity delivery",
      badge: "₹0",
      desc:
        "All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.",
    },
    {
      img: "media/images/intradayTrades.svg",
      alt: "Intraday and F&O trades",
      title: "Intraday and F&O trades",
      badge: "₹20",
      desc:
        "Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity. Flat ₹20 on all option trades.",
    },
    {
      img: "media/images/pricing0.svg",
      alt: "Direct mutual funds",
      title: "Direct mutual funds",
      badge: "₹0",
      desc:
        "All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.",
    },
  ];

  return (
    <section className="container py-5">
      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="fw-semibold mb-2">Charges</h2>
        <p className="text-muted mb-0">List of all charges and taxes</p>
      </div>

      {/* Cards */}
      <div className="row g-4 justify-content-center">
        {cards.map((c, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-4">
            <div className="p-4 rounded-4 border bg-white shadow-sm h-100 text-center">
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={c.img}
                  alt={c.alt}
                  className="img-fluid"
                  style={{ maxWidth: "220px" }}
                />
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <h4 className="mb-0 fw-semibold">{c.title}</h4>
                <span className="badge text-bg-primary px-3 py-2 rounded-pill">
                  {c.badge}
                </span>
              </div>

              <p className="text-muted mb-0" style={{ lineHeight: 1.8 }}>
                {c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChargesHero;