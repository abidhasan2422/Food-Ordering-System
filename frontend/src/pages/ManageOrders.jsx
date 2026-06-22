import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const ManageOrders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (status = "") => {
    const token = localStorage.getItem("admin_access");

    let url = "http://127.0.0.1:8000/api/admin/orders/";

    if (status) {
      url += `?status=${status}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(response.data);
  };
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("admin_access");

    await axios.patch(
      `http://127.0.0.1:8000/api/admin/orders/${id}/status/`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchOrders();
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(search.toLowerCase().trim()) ||
      order.full_name.toLowerCase().includes(search.toLowerCase().trim()) ||
      order.phone.includes(search.trim()),
  );
  return (
    <>
      <AdminLayout>
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Order Management</h2>

            <span className="badge bg-dark fs-6 p-2">
              Total Orders: {orders.length}
            </span>
          </div>

          {/* Filters */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-dark" onClick={() => fetchOrders()}>
                  All Orders
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => fetchOrders("Pending")}
                >
                  Pending
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => fetchOrders("Confirmed")}
                >
                  Confirmed
                </button>

                <button
                  className="btn btn-info text-white"
                  onClick={() => fetchOrders("Processing")}
                >
                  Processing
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => fetchOrders("Delivered")}
                >
                  Delivered
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => fetchOrders("Cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
          {/* <div className="row mb-4">

  <div className="col-md-4">

    <input
      type="text"
      className="form-control"
      placeholder="Search Order ID, Customer, Phone..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

  </div>
</div> */}
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search Order ID, Customer Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Orders Table */}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th width="220">Update Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No Orders Found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <Link
                              to={`/admin/order/${order.id}`}
                              className="badge bg-light text-dark border text-decoration-none p-2"
                            >
                              {order.order_number}
                            </Link>
                          </td>

                          <td>{order.full_name}</td>

                          <td>{order.phone}</td>

                          <td>
                            {new Date(order.created_at).toLocaleDateString(
  "en-GB",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
)}
                          </td>

                          <td>
                            <strong>৳{order.total_amount}</strong>
                          </td>

                          <td>
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
                          </td>

                          <td>
                            <select
                              className="form-select"
                              value={order.status}
                              onChange={(e) =>
                                updateStatus(order.id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>

                              <option value="Confirmed">Confirmed</option>

                              <option value="Processing">Processing</option>

                              <option value="Delivered">Delivered</option>

                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ManageOrders;
