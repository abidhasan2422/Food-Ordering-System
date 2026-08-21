import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import userApi from "../utils/userApi";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

           await userApi.post(
                "forgot-password/",
                {
                    email: email,
                }
            );

            toast.success("A password reset link has been sent to your email.");

            setEmail("");

        } catch (error) {

            const errors = error.response?.data;

            toast.error(
                errors?.message || "Something went wrong."
            );

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

                            <FaEnvelope size={35} />

                            <h3 className="mt-3 mb-0">
                                Forgot Password
                            </h3>

                        </div>

                        <div className="card-body p-4">

                            <p className="text-muted text-center mb-4">
                                Enter your registered email address.
                                We'll send you a password reset link.
                            </p>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
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
                                            ? "Sending..."
                                            : "Send Reset Link"
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
           <ToastContainer
  position="top-right"
  autoClose={3000}
/>
        </div>

    );

};

export default ForgotPassword;