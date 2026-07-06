import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import userApi from "../utils/userApi";

const PaymentFailed = () => {

  const { id } = useParams();

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
        style={{ maxWidth: "650px" }}
      >

        <div className="card-body text-center p-5">

          {/* Failed Icon */}

          <div
            className="
              bg-danger
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
            ✕
          </div>

          <h1 className="fw-bold text-danger mb-3">
            Payment Failed
          </h1>

          <p className="text-muted mb-4">
            Unfortunately, your payment could not be completed.
            <br />
            Please try again.
          </p>

          <div className="border rounded p-3 bg-light mb-4 text-start">

            <p>
              <strong>Order ID:</strong> {order.order_number}
            </p>

            <p>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              <span className="badge bg-danger">
                {order.payment_status}
              </span>
            </p>

            <p>
              <strong>Total Amount:</strong> ৳{order.total_amount}
            </p>

            <p className="mb-0">
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>

          </div>

          <div className="d-flex justify-content-center gap-3">

            <Link
              to="/cart"
              className="btn btn-danger"
            >
               Back to Cart
            </Link>

            <Link
              to="/my-orders"
              className="btn btn-primary"
            >
              My Orders
            </Link>

            <Link
              to="/menu"
              className="btn btn-success"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentFailed;