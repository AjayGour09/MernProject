import React, { useState } from "react";

const Register = () => {
  const [fromData, setFormdata] = useState({
    fullName: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div>
        <form onSubmit={handleSubmit} onReset={clearFormdata}>
          <div>
            <label htmlFor="">FullName</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="border p-1"
              value={FormData.fullName}
            />
          </div>
          <div>
            <label htmlFor="">Email</label>
            <input type="text" name="email" id="email" className="border p-1" />
          </div>
          <div>
            <label htmlFor="">Number</label>
            <input
              type="number"
              name="number"
              id="number"
              className="border p-1"
            />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border p-1"
            />
          </div>
          <div>
            <label htmlFor="">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="border p-1"
            />
          </div>
          <div>
            <button className="border p-1" type="submit">
              Submit Data
            </button>
            <button className="border p-1" type="reset">
              Reset Data
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
