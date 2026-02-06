import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/logo.svg"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "120px" }}
          />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* CENTER MENU */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3 text-center">
            <li className="nav-item">
              <NavLink className="nav-link nav-custom" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-custom" to="/products">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-custom" to="/pricing">
                Pricing
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-custom" to="/support">
                Support
              </NavLink>
            </li>
          </ul>

          {/* RIGHT AUTH BUTTONS */}
          <div className="d-flex flex-column flex-lg-row align-items-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            <Link to="/login" className="btn btn-outline-primary w-100 w-lg-auto">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary  w-lg-auto" style={{width:"140px"}}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
