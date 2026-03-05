import React, { useState } from "react";

const Hero = () => {

  const [search, setSearch] = useState("");

  const quickLinks = [
    "Track account opening",
    "Track segment activation",
    "Intraday",
    "Margins",
    "Kite user manual",
  ];

  const featured = [
    "Current Takeovers and Delisting – January 2024",
    "Latest intraday leverages – MIS & CO",
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <section className="bg-primary text-white py-5 mt-5">
      <div className="container">

        <div className="row align-items-start">

          {/* LEFT SIDE */}
          <div className="col-lg-6 mb-4">

            <h5 className="fw-semibold mb-3">
              Support Portal
            </h5>

            <p className="mb-4" style={{ opacity: 0.9 }}>
              Search for an answer or browse help topics to create a ticket
            </p>

            {/* SEARCH */}
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              className="form-control form-control-lg mb-4"
              placeholder="Eg: How do I activate F&O, why is my order getting rejected?"
            />

            {/* QUICK LINKS */}
            <div className="d-flex flex-wrap gap-2">

              {quickLinks.map((link, idx) => (

                <button
                  key={idx}
                  className="btn btn-outline-light btn-sm"
                >
                  {link}
                </button>

              ))}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6">

            <div className="d-flex justify-content-lg-end mb-3">

              <button className="btn btn-light btn-sm">
                Track Ticket
              </button>

            </div>

            <h6 className="fw-semibold mb-3">
              Featured
            </h6>

            <ol className="ps-3">

              {featured.map((item, idx) => (

                <li key={idx} className="mb-2">

                  <a
                    href="#"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.9 }}
                  >
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