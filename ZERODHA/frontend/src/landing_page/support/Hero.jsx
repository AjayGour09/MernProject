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

            <div className="d-flex flex-wrap gap-3">
              <a href="#" className="hero-link">Track account opening</a>
              <a href="#" className="hero-link">Track segment activation</a>
              <a href="#" className="hero-link">Intraday</a>
              <a href="#" className="hero-link">Margins</a>
              <a href="#" className="hero-link">Kite user manual</a>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-6 col-12">
            <div className="d-flex justify-content-end mb-3">
              <a href="#" className="hero-link fw-medium">
                Track Ticket
              </a>
            </div>

            <h6 className="mb-3 fw-semibold">Featured</h6>

            <ol className="ps-3 hero-list">
              <li className="mb-2">
                <a href="#" className="hero-link">
                  Current Takeovers and Delisting – January 2024
                </a>
              </li>
              <li>
                <a href="#" className="hero-link">
                  Latest intraday leverages – MIS & CO
                </a>
              </li>
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
