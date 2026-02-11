import React, { useState } from "react";
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormdata] = useState({
    fullName: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const clearFormdata = () => {
    setFormdata({
      fullName: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
    });
  };

  const validate = () => {
    let Error = {};

    if (formData.fullName.length < 3) {
      Error.fullName = "Name should be More Than 3 Characters";
    } else {
      if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
        Error.fullName = "Only Contain A-Z , a-z and space";
      }
    }

    if (
      !/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(
        formData.email,
      )
    ) {
      Error.email = "Use Proper Email Format";
    }

    if (!/^[6-9]\d{9}$/.test(formData.number)) {
      Error.number = "Only Indian Mobile Number allowed";
    }

    setValidationError(Error);

    return Object.keys(Error).length > 0 ? false : true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validate()) {
      setIsLoading(false);
      toast.error("Fill the Form Correctly");
      return;
    }
    console.log(formData);
    try {
      toast.success(res.data.message);
      const res = await axios.post("/api/register", formData);
      clearFormdata();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    } finally {
      setIsLoading(false);
    }
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
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className="border p-1"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="">Number</label>
            <input
              type="number"
              name="number"
              id="number"
              className="border p-1"
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border p-1"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="border p-1"
              value={formData.confirmPassword}
              onChange={handleChange}
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
