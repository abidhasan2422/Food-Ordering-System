import AdminLayout from "../components/AdminLayout";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("admin_access");
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_access");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/dashboard/stats/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        <h2>Dashboard</h2>
        <div className="row g-4">

          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
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

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
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

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
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

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
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

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaUsers size={35} className="text-info me-3" />
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

          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body ">
                <div className="d-flex align-items-center">
                  <FaUtensils size={35} className="text-danger me-3" />

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
        </div>
      </AdminLayout>
    );
  }
};

export default AdminDashboard;
