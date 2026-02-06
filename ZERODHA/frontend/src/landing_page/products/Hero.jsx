import React from "react";

const ProductsHero = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mt-5 fs-1 fw-bold">
        Zerodha Products
      </h2>
      <p className="text-center text-muted fs-5 mt-3">
        Sleek, modern, and intuitive trading platforms
      </p>
      <p className="text-center mt-3 fs-6">
        Check out our{" "}
        <span className="text-primary hover-text cursor-pointer">
          investment offerings →
        </span>
      </p>
    </div>
  );
};

export default ProductsHero;
