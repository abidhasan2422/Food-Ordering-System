import React, { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import userApi from "../utils/userApi";

const OrderSuccess = () => {
  const {id} = useParams();

    const [order, setOrder] = useState(null);
 useEffect(() => {

    const fetchOrder = async () => {

        try {

            const response = await userApi.get(
                `order/${id}/`
            );

            setOrder(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    fetchOrder();

}, [id]);
if (!order) {
    return (
        <div className="text-center mt-5">
            <h4>Loading...</h4>
        </div>
    );
}
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

      <div className="border rounded p-3 bg-light mb-4">

  <div className="d-flex justify-content-between mb-2">
    <strong>Order Status</strong>

    <span
      className={
        order.status === "Pending"
          ? "badge bg-warning text-dark"
          : order.status === "Confirmed"
          ? "badge bg-primary"
          : order.status === "Processing"
          ? "badge bg-info text-dark"
          : order.status === "Delivered"
          ? "badge bg-success"
          : "badge bg-danger"
      }
    >
      {order.status}
    </span>
  </div>

  <div className="d-flex justify-content-between mb-2">
    <strong>Payment Method</strong>
    <span>{order.payment_method}</span>
  </div>

  <div className="d-flex justify-content-between mb-2">
    <strong>Payment Status</strong>

    <span
      className={
        order.payment_status === "Paid"
          ? "badge bg-success"
          : order.payment_status === "Pending"
          ? "badge bg-warning text-dark"
          : "badge bg-danger"
      }
    >
      {order.payment_status}
    </span>
  </div>

  <div className="d-flex justify-content-between">
    <strong>Total Amount</strong>
    <span>৳{order.total_amount}</span>
  </div>

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