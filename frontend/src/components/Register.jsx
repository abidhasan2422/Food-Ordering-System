import PublicLayout from "./PublicLayout";
import "../styles/register.css";
import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Registration Successful");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        confirm_password: "",
      });
    } else {
      console.log(data);
      alert("Registration Failed");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <PublicLayout>
    <div className="register-page">
      <div className="container">
<div className="row align-items-stretch min-vh-100">
          {/* Left Side Form */}
          <div className="col-lg-6 d-flex">
            <div className="register-card w-100">

              <h2>Create Account</h2>
              <p className="text-muted mb-4">
                Register to order your favorite foods.
              </p>

              <form onSubmit={handleSubmit}>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Phone Number"
                    value={formData.mobile}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    placeholder="Confirm Password"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100"
                >
                  Register
                </button>

              </form>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="col-lg-6 d-flex">
              <div className="image-wrapper w-100">
            <img
              src="https://tinywebs.site/dLSFcC"
              alt="Food"
              className="img-fluid register-image"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
};

export default Register;