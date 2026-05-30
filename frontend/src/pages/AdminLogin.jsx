import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";


const AdminLogin = () => {
  const [adminData, setAdminData] = useState({
    username: "",
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
      alert(data.message);

      console.log(data);

      // Navigate to dashboard here
      // navigate("/admin/dashboard");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
};

  return (
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
            <label className="form-label">Username</label>

            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                name="username"
                value={adminData.username}
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
    </div>
  );
};

export default AdminLogin;