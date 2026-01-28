import React from "react";

const Hero = () => {
  return (
    <div className="container">
      <div className="" style={{ marginTop: "90px", marginBottom: "120px" }}>
        <h2 className="text-center fs-3 text-muted">
          We pioneered the discount broking model in India.
        </h2>
        <h2 className="text-center fs-3 text-muted">
          Now, we are breaking ground with our technology.
        </h2>
      </div>
      <span className="text-muted mb-5">
        {" "}
        <hr />
      </span>
      <div className="row p-5">
        <div className="col-6">
          <p className="mt-5 ms-5 text-muted font-text">
            We kick-started operations on the 15th of August, 2010 <br /> with the goal
            of breaking all barriers that traders and <br /> investors face in India in
            terms of cost, support, and <br /> technology. We named the company
            Zerodha, a  <br />combination of Zero and "Rodha", the Sanskrit word for <br />
            barrier.
          </p>
          <p className="mt-3 ms-5 text-muted font-text">
            Today, our disruptive pricing models and in-house <br />technology have
            made us the biggest stock broker in <br />India.
          </p>
          <p className="text-muted ms-5 mt-3 font-text">
            Over 1.6+ crore clients place billions of orders every year <br /> through
            our powerful ecosystem of investment <br /> platforms, contributing over
            15% of all Indian retail <br /> trading volumes.
          </p>
        </div>
      
        <div className="col-6">
          <p className="mt-5 text-muted font-text">
            In addition, we run a number of popular open online <br />educational and
            community initiatives to empower retail <br />
            traders and investors.
          </p>
          <p className="font-text mt-3 text-muted">
           <span className="text-primary hover-text cursor-pointer"> Rainmatter</span>, our fintech fund and incubator, has invested <br /> in several
            fintech startups with the goal of growing the <br /> Indian capital
            markets.
          </p>
          <p className="font-text mt-3 text-muted">
            And yet, we are always up to something new every day. <br /> Catch up on
            the latest updates on our <span className="text-primary hover-text cursor-pointer">blog</span> or see what <br /> the media is <span className="text-primary hover-text cursor-pointer">saying about
            us</span> or learn more about our <br /> business and product <span className="text-primary hover-text cursor-pointer">philosophies.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
