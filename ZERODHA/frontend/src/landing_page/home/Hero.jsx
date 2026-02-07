import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="container py-5 text-center">
      {/* Hero Image */}
      <div className="mb-4">
        <img
          src="media/images/homeHero.png"
          alt="Hero"
          className="img-fluid"
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Heading */}
      <h1 className="mb-3">Invest in everything</h1>
      <p className="text-muted mb-4">
        Online platform to invest in stocks, derivatives, mutual funds, and more
      </p>

      {/* CTA Button */}
      <div>
        <Link to='signup'>
          <button className="btn btn-outline-primary btn-lg px-4 py-2">
            Sign Up Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
