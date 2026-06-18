import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="container py-5 text-center">

      <div className="card shadow border-0 p-5">

        <h1 className="text-success mb-4">
          ✅ Order Placed Successfully
        </h1>

        <p className="lead">
          Thank you for your order.
        </p>

        <p>
          Your order is now being processed.
        </p>

        <h5 className="mt-3">
          Status:
          <span className="badge bg-warning ms-2">
            Pending
          </span>
        </h5>

        <div className="mt-4">

          <Link
            to="/my-orders"
            className="btn btn-primary me-2"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="btn btn-success"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;