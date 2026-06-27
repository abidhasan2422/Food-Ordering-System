import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import userApi from "../utils/userApi";
import { toast,ToastContainer } from "react-toastify";
import PublicLayout from "../components/PublicLayout";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     try{
//        const response =  await userApi.put("change_password/",formData);
//       console.log(formData);
//     } catch (error) {
//     const errors = error.response?.data;

//     if (errors.message) {
//         toast.error(errors.message);
//     } else {
//         const firstField = Object.keys(errors)[0];
//         toast.error(errors[firstField][0]);
//     }
// }

//   };
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await userApi.put("change_password/", formData);

        console.log(response.data); // Check this

        toast.success(response.data.message);

    } catch (error) {
        console.log(error.response?.data);

        const errors = error.response?.data;

        if (errors.message) {
            toast.error(errors.message);
        } else {
            const firstKey = Object.keys(errors)[0];
            toast.error(errors[firstKey][0]);
        }
    }
};

  return (
    <PublicLayout>
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-6 col-md-8">

          <div className="card shadow border-0 rounded-4">

            <div className="card-header bg-dark text-white text-center py-4">
              <FaLock size={35} />
              <h3 className="mt-2 mb-0">Change Password</h3>
            </div>

            <div className="card-body p-4">

              <div className="alert alert-info">
                For your security, choose a strong password that you don't use on other websites.
              </div>

              <form onSubmit={handleSubmit}>

                {/* Old Password */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Current Password
                  </label>

                  <div className="input-group">

                    <input
                      type={showOld ? "text" : "password"}
                      className="form-control"
                      name="old_password"
                      value={formData.old_password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowOld(!showOld)}
                    >
                      {showOld ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>

                {/* New Password */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    New Password
                  </label>

                  <div className="input-group">

                    <input
                      type={showNew ? "text" : "password"}
                      className="form-control"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>

                {/* Confirm Password */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div className="input-group">

                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>

                {/* Password Tips */}

                <div className="alert alert-light border">

                  <h6 className="fw-bold mb-2">
                    Password Requirements
                  </h6>

                  <ul className="mb-0">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>

                </div>

                {/* Buttons */}

                <div className="d-flex justify-content-end gap-2 mt-4">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark"
                  >
                    Update Password
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000} />
    </div>
    </PublicLayout>
  );
};

export default ChangePassword;