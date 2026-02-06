import React from "react";
import { GoArrowRight } from "react-icons/go";

const Stats = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center gy-4">
        {/* Text Content */}
        <div className="col-12 col-md-6">
          <h2 className="fs-3 mb-4">Trust With Confidence</h2>

          <h3 className="fs-5 mb-2">Customer-first always</h3>
          <p className="text-muted mb-3">
            That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores
            of equity investments, making us India’s largest broker;
            contributing to 15% of daily retail exchange volumes in India.
          </p>

          <h3 className="fs-5 mb-2">No spam or gimmicks</h3>
          <p className="text-muted mb-3">
            No gimmicks, spam, gamification, or annoying push notifications.
            High quality apps that you use at your pace, the way you like.
          </p>

          <h3 className="fs-5 mb-2">The Zerodha universe</h3>
          <p className="text-muted mb-3">
            Not just an app, but a whole ecosystem. Our investments in 30+ fintech
            startups offer you tailored services specific to your needs.
          </p>

          <h3 className="fs-5 mb-2">Do better with money</h3>
          <p className="text-muted mb-3">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your money.
          </p>
        </div>

        {/* Image + Links */}
        <div className="col-12 col-md-6 text-center text-md-start">
          <img
            src="media/images/ecosystem.png"
            alt="Ecosystem"
            className="img-fluid mb-3"
            style={{ maxWidth: "95%" }}
          />
          <div className="d-flex flex-column flex-md-row gap-2">
            <a href="#" className="text-decoration-none text-primary">
              Explore our products <GoArrowRight />
            </a>
            <a href="#" className="text-decoration-none text-primary">
              Try Kite demo <GoArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
