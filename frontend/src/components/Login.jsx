import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import "../styles/login.css";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userApi from "../utils/userApi";

const Login = () => {
  const navigate = useNavigate()
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
    const response = await userApi.post("login/", {
      identifier: formData.identifier,
      password: formData.password,
    });

    const data = response.data;

    console.log(data);

    
    toast.success("Login Successful");

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    navigate("/login");

    setFormData({
      identifier: "",
      password: "",
    });

    console.log("Tokens stored successfully!", data);

  } catch (error) {
    console.log(error);

    if (error.response?.status === 429) {
      toast.warning(
        "Too many login attempts. Please try again later."
      );
    } else {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid Credentials";

      toast.warning(message);
    }
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
      <ToastContainer
  position="top-right"
  autoClose={3000}
/>
    </PublicLayout>
    
  );
};

export default Login;