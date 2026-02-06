import React from "react";

const Hero = () => {
  return (
    <div className="container">
      {/* Heading Section */}
      <div className="text-center my-5 py-5">
        <h2 className="fs-5 fs-md-3 text-muted">
          We pioneered the discount broking model in India.
        </h2>
        <h2 className="fs-5 fs-md-3 text-muted">
          Now, we are breaking ground with our technology.
        </h2>
      </div>

      <hr className="text-muted mb-5" />

      {/* Content Section */}
      <div className="row gy-4 px-2 px-md-5">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <p className="text-muted font-text">
            We kick-started operations on the 15th of August, 2010 with the goal
            of breaking all barriers that traders and investors face in India in
            terms of cost, support, and technology. We named the company Zerodha,
            a combination of Zero and "Rodha", the Sanskrit word for barrier.
          </p>

          <p className="text-muted font-text">
            Today, our disruptive pricing models and in-house technology have
            made us the biggest stock broker in India.
          </p>

          <p className="text-muted font-text">
            Over 1.6+ crore clients place billions of orders every year through
            our powerful ecosystem of investment platforms, contributing over
            15% of all Indian retail trading volumes.
          </p>
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-6">
          <p className="text-muted font-text">
            In addition, we run a number of popular open online educational and
            community initiatives to empower retail traders and investors.
          </p>

          <p className="text-muted font-text">
            <span className="text-primary hover-text cursor-pointer">
              Rainmatter
            </span>
            , our fintech fund and incubator, has invested in several fintech
            startups with the goal of growing the Indian capital markets.
          </p>

          <p className="text-muted font-text">
            And yet, we are always up to something new every day. Catch up on the
            latest updates on our{" "}
            <span className="text-primary hover-text cursor-pointer">blog</span>{" "}
            or see what the media is{" "}
            <span className="text-primary hover-text cursor-pointer">
              saying about us
            </span>{" "}
            or learn more about our business and product{" "}
            <span className="text-primary hover-text cursor-pointer">
              philosophies
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
