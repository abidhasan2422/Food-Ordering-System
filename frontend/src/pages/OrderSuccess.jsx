import React,{useState} from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
 <div className="container py-5">

  <div
    className="card border-0 shadow-lg mx-auto"
    style={{
      maxWidth: "650px",
    }}
  >

    <div className="card-body text-center p-5">

      {/* Success Icon */}

      <div
        className="
        bg-success
        rounded-circle
        d-inline-flex
        align-items-center
        justify-content-center
        mb-4
        "
        style={{
          width: "90px",
          height: "90px",
          fontSize: "42px",
          color: "white",
        }}
      >
        ✓
      </div>

      <h1 className="fw-bold text-success mb-3">
        Order Placed Successfully
      </h1>

      <p className="text-muted mb-4">
        Thank you for your order.
        <br />
        Your order is being processed.
      </p>

      <div className="mb-4">

        <span className="me-2">
          Status:
        </span>

        <span className="badge bg-warning text-dark px-3 py-2">
          Pending
        </span>

      </div>

      <div className="d-flex justify-content-center gap-3">

        <Link
          to="/my-orders"
          className="btn btn-primary px-4"
        >
          My Orders
        </Link>

        <Link
          to="/"
          className="btn btn-success px-4"
        >
          Continue Shopping
        </Link>

      </div>

    </div>

  </div>

</div>
  );
};

export default OrderSuccess;