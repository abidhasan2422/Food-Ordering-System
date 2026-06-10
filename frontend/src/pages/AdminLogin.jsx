import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { toast,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/admin-login/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(adminData),
      }
    );

    const data = await response.json();

if (response.ok) {
  console.log("Response Data:", data);

  localStorage.setItem("admin_access", data.access);
  localStorage.setItem("admin_refresh", data.refresh);

  console.log(
    "Stored Token:",
    localStorage.getItem("admin_access")
  );

  // setTimeout(() => {
  //   navigate("/admin-dashboard");
  // }, 2000);
  console.log("Navigating to dashboard");
  navigate("/admin-dashboard");

      console.log(data);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);

    toast.error("Server Error");
  }
};

  return (
     <>
      <Navbar />
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
          backgroundImage: "url('/images/adminlogin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center mb-4">
          <FaUser className="me-2 text-primary" />
          Admin Login
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Email</label>

            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Enter Email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>

            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>

              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-primary w-100">
            <FaSignInAlt className="me-2" />
            Login
          </button>
        </form>
      </div>
       <ToastContainer position="top-right" autoClose={2000}/>
    </div>
    
    </>
  );
};

export default AdminLogin;