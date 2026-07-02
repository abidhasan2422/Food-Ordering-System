import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../utils/userApi";

const ResetPassword = () => {

    const navigate = useNavigate();

    const { uid, token } = useParams();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        new_password: "",
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

        setLoading(true);

        try {

            const response = await userApi.post(
                "reset-password/",
                {
                    uid: uid,
                    token: token,
                    new_password: formData.new_password,
                    confirm_password: formData.confirm_password,
                }
            );

            toast.success(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            const errors = error.response?.data;

            if (errors?.message) {

                toast.error(errors.message);

            } else if (errors?.confirm_password) {

                toast.error(errors.confirm_password[0]);

            } else if (errors?.new_password) {

                toast.error(errors.new_password[0]);

            } else {

                toast.error("Something went wrong.");

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-5 col-md-7">

                    <div className="card shadow border-0 rounded-4">

                        <div className="card-header bg-dark text-white text-center py-4">

                            <FaLock size={35} />

                            <h3 className="mt-3 mb-0">
                                Reset Password
                            </h3>

                        </div>

                        <div className="card-body p-4">

                            <p className="text-muted text-center mb-4">
                                Enter your new password below.
                            </p>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="new_password"
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={formData.new_password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-control"
                                        placeholder="Confirm new password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 py-2"
                                    disabled={loading}
                                >
                                    {
                                        loading
                                            ? "Resetting..."
                                            : "Reset Password"
                                    }
                                </button>

                            </form>

                            <div className="text-center mt-4">

                                <Link
                                    to="/login"
                                    className="text-decoration-none"
                                >
                                    ← Back to Login
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ResetPassword;