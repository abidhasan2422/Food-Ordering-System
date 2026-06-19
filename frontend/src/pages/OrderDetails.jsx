import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          `http://127.0.0.1:8000/api/order/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
      <div className="container py-5 text-center">
        <h3>Loading Order Details...</h3>
      </div>
    );
  }
  console.log(order);
console.log(order.items);

  return (
    <PublicLayout>
      <div className="container py-5">

        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            Order Details
          </h2>

          <Link
            to="/my-orders"
            className="btn btn-outline-secondary"
          >
            Back To Orders
          </Link>
          
        </div> */}
        <div className="d-flex justify-content-between align-items-center mb-4">
  <h2 className="fw-bold">
    Order Details
  </h2>

  <div className="d-flex gap-2">

    <a
      href={`http://127.0.0.1:8000/api/order/${order.id}/invoice/`}
      className="btn btn-danger"
    >
      <i className="fas fa-file-pdf me-2"></i>
      Download Invoice
    </a>

    <Link
      to="/my-orders"
      className="btn btn-outline-secondary"
    >
      Back To Orders
    </Link>

  </div>
</div>

        <div className="card shadow border-0 mb-4">
          <div className="card-body">

            <div className="row">

              <div className="col-md-6">
                <h5 className="fw-bold mb-3">
                  Order Information
                </h5>

                <p>
                  <strong>Order ID:</strong>{" "}
                  {order.order_number}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-warning text-dark">
                    {order.status}
                  </span>
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment_method}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold mb-3">
                  Customer Information
                </h5>

                <p>
                  <strong>Name:</strong>{" "}
                  {order.full_name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.phone}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.email}
                </p>
              </div>

            </div>

          </div>
        </div>

        <div className="card shadow border-0 mb-4">
          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Delivery Address
            </h5>

            <p>
              <strong>Area:</strong> {order.area}
            </p>

            <p>
              <strong>City:</strong> {order.city}
            </p>

            <p>
              <strong>Address:</strong>
              <br />
              {order.address}
            </p>

          </div>
        </div>

        <div className="card shadow border-0 mb-4">
          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Ordered Items
            </h5>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.food_name}</td>

                    <td>{item.quantity}</td>

                    <td>৳{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

        <div className="card shadow border-0">
          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Payment Summary
            </h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>৳{order.subtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Delivery Charge</span>
              <span>৳{order.delivery_charge}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">
                Total
              </h4>

              <h4 className="text-success fw-bold">
                ৳{order.total_amount}
              </h4>
            </div>

          </div>
        </div>

      </div>
    </PublicLayout>
  );
};

export default OrderDetails;