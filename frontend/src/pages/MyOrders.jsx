import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import userApi from "../utils/userApi";

import PublicLayout from "../components/PublicLayout";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
   const fetchOrders = async () => {

  try {

    const response = await userApi.get("my-orders/");

    setOrders(response.data);

  } catch (error) {

    console.log(error);

  }

};

    fetchOrders();
  }, []);
  return (
    <PublicLayout>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">My Orders</h1>

          <p className="text-muted">Track and manage all your orders</p>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="
            card
            border-0
            shadow-sm
            mb-4
          "
          >
            <div
              className="
              card-body
            "
            >
              <div
                className="
                d-flex
                justify-content-between
                align-items-center
              "
              >
                <div>
  <h5 className="mb-1 fw-bold">
    Order #{order.order_number}
  </h5>

  <small className="text-muted">
    Ordered on{" "}
    {new Date(order.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}{" "}
    at{" "}
    {new Date(order.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </small>
</div>

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
  {order.status === "Delivered" && "✓ "}
  {order.status === "Cancelled" && "✕ "}
  {order.status}
</span>
              </div>

              <hr />

              <h4
                className="
                text-success
              "
              >
                ৳{order.total_amount}
              </h4>

              <Link
                to={`/order/${order.id}`}
                className="btn btn-outline-primary mt-3"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PublicLayout>
  );
};

export default MyOrders;
