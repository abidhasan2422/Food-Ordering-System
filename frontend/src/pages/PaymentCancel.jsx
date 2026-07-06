import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import userApi from "../utils/userApi";

const PaymentCancel = () => {

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
        style={{
          maxWidth: "650px",
        }}
      >

        <div className="card-body text-center p-5">

          {/* Cancel Icon */}

          <div
            className="
              bg-warning
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
            !
          </div>

          <h1 className="fw-bold text-warning mb-3">
            Payment Cancelled
          </h1>

          <p className="text-muted mb-4">
            You cancelled the payment.
            <br />
            No payment was completed.
          </p>

          <div className="border rounded p-3 bg-light mb-4 text-start">

            <div className="d-flex justify-content-between mb-2">
              <strong>Order ID</strong>
              <span>{order.order_number}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <strong>Payment Method</strong>
              <span>{order.payment_method}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <strong>Payment Status</strong>

              <span className="badge bg-warning text-dark">
                {order.payment_status}
              </span>

            </div>

            <div className="d-flex justify-content-between mb-2">
              <strong>Total Amount</strong>
              <span>৳{order.total_amount}</span>
            </div>

            <div className="d-flex justify-content-between">
              <strong>Date</strong>
              <span>
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>

          </div>

          <div className="d-flex justify-content-center gap-3">

            <Link
              to="/my-orders"
              className="btn btn-primary"
            >
              My Orders
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

    </div>

  );

};

export default PaymentCancel;