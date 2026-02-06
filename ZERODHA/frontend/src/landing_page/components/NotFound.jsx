import React from 'react';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "60vh", padding: "2rem" }}>
      <h1 className="display-4 fw-bold mb-3">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" className="btn btn-primary">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
