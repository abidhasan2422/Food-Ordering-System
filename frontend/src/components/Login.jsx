import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import "../styles/login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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
      "http://127.0.0.1:8000/api/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();
        console.log(data);
    if (response.ok) {
      alert("Login Successful");

      // Save JWT tokens to LocalStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      
      //  Save user profile info
      localStorage.setItem("user", JSON.stringify(data.user));

      // Clear Form
      setFormData({
        identifier: "",
        password: "",
      });

      console.log("Tokens stored successfully!", data);
      


    } else {
      // Handles the error object returned from your Django view
      alert(data.error || "Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong with the server connection");
  }
};

  return (
    <PublicLayout>
      <div className="login-page">
        <div className="container">
          <div className="login-card">

            <h2>Welcome Back</h2>

            <p className="text-muted mb-4">
              Login to order your favorite foods.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <input
                  type="text"
                  name="identifier"
                  placeholder="Email or Phone Number"
                  className="form-control"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />

                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    // <FaEyeSlash />
                    <FaEye />
                  ) : (
                    <FaEyeSlash />
                    // <FaEye />
                  )}
                </span>
              </div>

              <div className="text-end mb-3">
                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 login-btn"
              >
                Login
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <p className="text-center mt-4">
              Don't have an account?
              <Link
                to="/register"
                className="register-link"
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;