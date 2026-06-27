import React, { useEffect, useState } from "react";
import userApi from "../utils/userApi";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import {FaTimes , FaSave} from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       

        const response = await userApi.get(
          "profile/",
          
        );

        setFormData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      

      await userApi.put(
        "update/profile/",
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          mobile: formData.mobile,
        },
        
      );

      alert("Profile Updated Successfully");

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PublicLayout>
    {/* <div className="container py-3"> */}
    <div className="container mt-4 mb-4">
      <div className="row justify-content-center">

        <div className="col-lg-7">

          <div className="card shadow border-0 rounded-4">

            <div className="card-header bg-dark text-white text-center py-4">
              <h3 className="mb-0">Edit Profile</h3>
<p>Update your personal information below.</p>            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    First Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Last Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control bg-light"
                    value={formData.email}
                    disabled
                  />
                </div> */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="d-flex justify-content-end gap-2">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/profile")}
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark"
                  >
                      <FaSave className="me-2" />
                    Save Changes
                  </button>

                </div> */}
                <div className="d-flex justify-content-end gap-3 mt-4">

  <button
    type="button"
    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
    onClick={() => navigate("/profile")}
    style={{
      minWidth: "170px",
      height: "50px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      transition: "0.3s ease",
    }}
  >
    <FaTimes size={18} className="me-2" />
    Cancel
  </button>

  <button
    type="submit"
    className="btn btn-dark d-flex align-items-center justify-content-center"
    style={{
      minWidth: "170px",
      height: "50px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      transition: "0.3s ease",
    }}
  >
    <FaSave size={18} className="me-2" />
    Save Changes
  </button>

</div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
    </PublicLayout>
  );
};

export default EditProfile;