import AdminLayout from "../components/AdminLayout";
import { Navigate } from "react-router-dom";
import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import adminApi from "../utils/adminApi";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUsers,
  FaUtensils,
  FaSpinner,
  FaTags,
} from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, Legend } from "recharts";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("admin_access");
  const pieData = [
    {
      name: "Pending",
      value: stats.pending_orders,
    },
    {
      name: "Confirmed",
      value: stats.confirmed_orders,
    },
    {
      name: "Processing",
      value: stats.processing_orders,
    },
    {
      name: "Delivered",
      value: stats.delivered_orders,
    },
    {
      name: "Cancelled",
      value: stats.cancelled_orders,
    },
  ];
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const response = await adminApi.get(
        "admin/dashboard/stats/",
  
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return <Navigate to="/admin-login" />;
  } else {
    return (
      <AdminLayout>
        <div className="mb-4">
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, Administrator 👋</p>
          <small className="text-secondary">
            📅{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </small>
        </div>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card border-0  dashboard-card shadow-sm h-100">
              {" "}
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <FaShoppingBag size={40} className="text-primary me-3" />

                  <div>
                    <h6 className="text-muted mb-1">Total Orders</h6>

                    <h2 className="fw-bold text-primary mb-0">
                      {stats.total_orders}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0  dashboard-card shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaClock size={40} className="text-warning me-3" />
                  <div>
                    <h6 className="text-muted mb-1">Pending Orders</h6>

                    <h2 className="fw-bold text-warning mb-0">
                      {stats.pending_orders}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0   dashboard-card shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaCheckCircle size={40} className="text-success me-3" />
                  <div>
                    <h6 className="text-muted mb-1">Delivered Orders</h6>

                    <h2 className="fw-bold text-success mb-0">
                      {stats.delivered_orders}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 dashboard-card  shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaSpinner size={40} className="text-info me-3" />
                  <div>
                    <h6 className="text-muted mb-1">Processing Orders</h6>

                    <h2 className="fw-bold text-info mb-0">
                      {stats.processing_orders}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0  dashboard-card shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaMoneyBillWave size={40} className="text-success me-3" />
                  <div>
                    <h6 className="text-muted mb-1">Total Revenue</h6>

                    <h2 className="fw-bold text-success mb-0">
                      ৳{stats.total_revenue}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0  dashboard-card shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaUsers size={40} className="text-info me-3" />
                  <div>
                    <h6 className="text-muted mb-1">Customers</h6>

                    <h2 className="fw-bold text-info mb-0">
                      {stats.total_users}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 dashboard-card  shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaUtensils size={40} className="text-danger me-3" />

                  <div>
                    <h6 className="text-muted mb-1">Foods</h6>

                    <h2 className="fw-bold text-danger mb-0">
                      {stats.total_foods}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0  dashboard-card shadow-sm h-100">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaTags size={40} className="text-danger me-3" />

                  <div>
                    <h6 className="text-muted mb-1">Category</h6>

                    <h2 className="fw-bold text-danger mb-0">
                      {stats.total_category}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h5 className="mb-4">Order Status Distribution</h5>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={120}
                      innerRadius={60}
                    >
                      <Cell fill="#ffc107" />
                      <Cell fill="#0d6efd" />
                      <Cell fill="#0dcaf0" />
                      <Cell fill="#198754" />
                      <Cell fill="#dc3545" />
                    </Pie>
                    <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>

                      <span className="badge bg-primary">Confirmed</span>

                      <span className="badge bg-info text-dark">
                        Processing
                      </span>

                      <span className="badge bg-success">Delivered</span>

                      <span className="badge bg-danger">Cancelled</span>
                    </div>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h5 className="mb-4">Revenue Trend</h5>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.revenue_chart}>
                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#198754"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">Recent Orders</h5>

            <small className="text-muted">Latest 5 orders</small>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recent_orders?.map((order, index) => (
                    <tr key={index}>
                      <td>{order.order_number}</td>

                      <td>{order.customer}</td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
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

                      <td>৳{order.total}</td>
                      <td>
                        <Link
                          to={`/admin/order/${order.id}`}
                          className="badge rounded-pill bg-primary-subtle text-primary border text-decoration-none px-3 py-2"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
};

export default AdminDashboard;
