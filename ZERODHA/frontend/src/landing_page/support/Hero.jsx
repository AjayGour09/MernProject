import React from "react";

const Hero = () => {
  return (
    <section className="bg-primary text-white py-5 mt-5 hero-section">
      <div className="container">
        <div className="row align-items-start">

          {/* LEFT SECTION */}
          <div className="col-lg-6 col-12 mb-4">
            <h5 className="mb-3 fw-semibold">Support Portal</h5>

            <p className="hero-subtext mb-4">
              Search for an answer or browse help topics to create a ticket
            </p>

            <input
              type="text"
              className="form-control form-control-lg hero-search mb-4"
              placeholder="Eg: How do I activate F&O, why is my order getting rejected?"
            />

            <div className="d-flex flex-wrap gap-2">
              {[
                "Track account opening",
                "Track segment activation",
                "Intraday",
                "Margins",
                "Kite user manual"
              ].map((link, idx) => (
                <a key={idx} href="#" className="hero-link btn btn-outline-light btn-sm mb-2 text-danger">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-6 col-12">
            <div className="d-flex justify-content-lg-end justify-content-start mb-3">
              <a href="#" className="hero-link text-danger btn btn-outline-light btn-sm">
                Track Ticket
              </a>
            </div>

            <h6 className="mb-3 fw-semibold">Featured</h6>

            <ol className="ps-3 hero-list">
              {[
                "Current Takeovers and Delisting – January 2024",
                "Latest intraday leverages – MIS & CO"
              ].map((item, idx) => (
                <li key={idx} className="mb-2">
                  <a href="#" className="hero-link text-white text-decoration-none">
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
