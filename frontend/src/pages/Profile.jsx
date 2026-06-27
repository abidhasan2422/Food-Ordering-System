import React,{ useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import userApi from "../utils/userApi";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
    const fetchProfile = async () => {
      try {

        const response = await userApi.get("profile/");

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);
   if (!user) {
    return <h3>Loading...</h3>;
  }
 return (
    <PublicLayout>
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-lg-6 col-md-8">
        <div className="card shadow border-0 rounded-4">

          {/* Header */}
          <div className="card-header bg-dark text-white text-center py-4 rounded-top-4">
            <div
              className="rounded-circle bg-white text-dark d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{ width: "90px", height: "90px", fontSize: "35px", fontWeight: "bold" }}
            >
              {user.first_name.charAt(0)}
            </div>

            <h3 className="mb-1">
              {user.first_name} {user.last_name}
            </h3>

            <p className="mb-0">{user.email}</p>
          </div>

          {/* Body */}
          <div className="card-body p-4">

            <div className="row mb-3">
              <div className="col-5 fw-bold">First Name</div>
              <div className="col-7">{user.first_name}</div>
            </div>

            <hr />

            <div className="row mb-3">
              <div className="col-5 fw-bold">Last Name</div>
              <div className="col-7">{user.last_name}</div>
            </div>

            <hr />

            <div className="row mb-3">
              <div className="col-5 fw-bold">Email</div>
              <div className="col-7">{user.email}</div>
            </div>

            <hr />

            <div className="row mb-3">
              <div className="col-5 fw-bold">Mobile</div>
              <div className="col-7">{user.mobile}</div>
            </div>

            <hr />

            <div className="row">
              <div className="col-5 fw-bold">Member Since</div>
              <div className="col-7">
                {new Date(user.reg_date).toLocaleDateString()}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="card-footer bg-white border-0 text-center pb-4">
            <button className="btn btn-dark px-4 me-2 "
             onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>

            <button className="btn btn-outline-dark px-4">
              Change Password
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
   </PublicLayout>
);
}

export default Profile;