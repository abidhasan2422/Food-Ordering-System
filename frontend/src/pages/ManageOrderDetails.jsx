import React, { useEffect, useState } from "react";
import adminApi from "../utils/adminApi";

import { useParams, Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const ManageOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

useEffect(() => {
    const fetchOrder = async () => {
        try {
            const response = await adminApi.get(
                `admin/order/${id}/`
            );

            setOrder(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    fetchOrder();
}, [id]);

  if (!order) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Order Details</h2>

          <div>
             <a
    href={`${process.env.REACT_APP_API_URL}/order/${order.id}/invoice/`}
    className="btn btn-danger me-2"
  >
              <i className="fas fa-file-pdf me-2"></i>
              Download Invoice
            </a>

            <Link to="/admin/orders" className="btn btn-dark">
              Back
            </Link>
          </div>
        </div>

        <div className="row">



          <div className="col-md-6 mb-4">
  <div className="card shadow-sm border-0">
    <div className="card-body">
      <h4 className="mb-3">Order Information</h4>

      <p>
        <strong>Order ID:</strong> {order.order_number}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(order.created_at).toLocaleString()}
      </p>

      <p>
        <strong>Payment Method:</strong> {order.payment_method}
      </p>

      <p>
        <strong>Payment Status:</strong>{" "}
        <span
          className={
            order.payment_status === "Paid"
              ? "badge bg-success"
              : order.payment_status === "Pending"
              ? "badge bg-warning text-dark"
              : order.payment_status === "Failed"
              ? "badge bg-danger"
              : "badge bg-secondary"
          }
        >
          {order.payment_status}
        </span>
      </p>

      {order.transaction_id && (
        <p>
          <strong>Transaction ID:</strong> {order.transaction_id}
        </p>
      )}

      <p className="mb-0">
        <strong>Status:</strong>

        <span
          className={
            order.status === "Pending"
              ? "badge bg-warning text-dark ms-2"
              : order.status === "Confirmed"
              ? "badge bg-primary ms-2"
              : order.status === "Processing"
              ? "badge bg-info ms-2"
              : order.status === "Delivered"
              ? "badge bg-success ms-2"
              : "badge bg-danger ms-2"
          }
        >
          {order.status}
        </span>
      </p>
    </div>
  </div>
</div>



          {/* Customer */}

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="mb-3">Customer Information</h4>

                <p>
                  <strong>Name:</strong> {order.full_name}
                </p>

                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>

                <p>
                  <strong>Email:</strong> {order.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="mb-3">Delivery Address</h4>

            <p>
              <strong>Area:</strong> {order.area}
            </p>

            <p>
              <strong>City:</strong> {order.city}
            </p>

            <p>
              <strong>Address:</strong> {order.address}
            </p>
          </div>
        </div>

        {/* Items */}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="mb-3">Ordered Items</h4>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${item.image}`}
                        alt={item.item_name}
                        width="80"
                        height="80"
                        className="rounded shadow-sm"
                        style={{ objectFit: "cover" }}
                      />
                    </td>

                    <td>{item.item_name}</td>

                    <td>{item.quantity}</td>

                    <td>৳{item.price}</td>

                    <td>৳{(Number(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment */}

        <div className="bg-light rounded p-4">
          <div className="d-flex justify-content-between mb-3">
            <span>Subtotal</span>
            <strong>৳{order.subtotal}</strong>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <span>Delivery Charge</span>
            <strong>৳{order.delivery_charge}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <h5 className="fw-bold mb-0">Total Amount</h5>

            <h4 className="fw-bold text-success mb-0">৳{order.total_amount}</h4>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrderDetails;
