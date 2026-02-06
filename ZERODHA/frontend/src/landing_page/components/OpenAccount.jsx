import React from 'react';
import { Link } from 'react-router-dom';

const OpenAccount = () => {
  return (
    <div className="py-5" style={{ marginTop: "120px" }}>
      <h2 className="text-center mb-3">
        Open a Zerodha Account
      </h2>

      <p className="text-center text-muted mb-4 px-3 px-md-5">
        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.
      </p>

      <div className="text-center">
        <Link
          to="/signup"
          className="btn btn-primary btn-lg px-4 py-2"
        >
          Sign Up for free
        </Link>
      </div>
    </div>
  );
};

export default OpenAccount;
