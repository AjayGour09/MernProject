import React from "react";

const NavBar = () => {
  return (
    <nav
      class="navbar navbar-expand-lg  bg-body-tertiary border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div class="container p-2">
        <a class="navbar-brand" href="#">
          <img src="media/images/logo.svg" alt="" style={{ width: "25%" }} />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-5 flex gap-5">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Signup
              </a>
            </li>
             <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                About
              </a>
            </li>
             <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Products
              </a>
            </li>
             <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Pricing
              </a>
            </li>
             <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
