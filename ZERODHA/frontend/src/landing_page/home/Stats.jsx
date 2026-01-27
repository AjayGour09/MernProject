import React from "react";
import { GoArrowRight } from "react-icons/go";

const Stats = () => {
  return (
    <div className="container">
      <div className="row p-5">
        <div className="col-6 p-5">
          <h2 className="mt-2 mb-5 fs-3">Trust With Confidence.</h2>
          <h3 className="fs-4">Customer-first always</h3>
          <p className="text-muted">
            That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores
            of equity investments, making us India’s largest broker;
            contributing to 15% of daily retail exchange volumes in India.
          </p>
          <h3 className="mt-4 mb-3 fs-4">No spam or gimmicks</h3>
          <p className="text-muted">
            No gimmicks, spam, gamification, or annoying push notifications.
            High quality apps that you use at your pace, the way you like.{" "}
          </p>
          <h3 className="mt-4 fs-4">The Zerodha universe</h3>
          <p className="text-muted">
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>
          <h3 className="mt-4 fs-4">Do better with money</h3>
          <p className="text-muted">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your
            money.
          </p>
        </div>
        <div className="col-6 p-5">
          <img src="media/images/ecosystem.png" alt="" className="" style={{width:"95%"}} />
          <div className="d-flex gap-3 mt-3 ms-4">
            <a href="#" className="mr-5 text-decoration-none ">Explore our products <GoArrowRight /></a>
            <a href="" className="text-decoration-none">Try Kite demo <GoArrowRight /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
