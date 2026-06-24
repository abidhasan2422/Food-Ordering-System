import React, { useEffect, useState } from "react";
import api from "../utils/adminApi";
import AdminLayout from "../components/AdminLayout";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
const OrderReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("All Orders");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);

  const [report, setReport] = useState(null);

const downloadPDF = async () => {

  try {

  const response = await api.get(
  "admin/order-report/pdf/",
  {
    params: {
      status,
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  }
);

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "Order_Report.pdf"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

  }

};

const downloadExcel = async () => {

  try {

    const response = await api.get(
      "admin/order-report/excel/",
      {
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "Order_Report.xlsx"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

  }

};

  useEffect(() => {
    fetchReport();
  }, [status, fromDate, toDate, currentPage]);

  const fetchReport = async () => {
    try {
      const response = await api.get("admin/order-report/", {
        params: {
          status,
          from_date: fromDate,
          to_date: toDate,
          page: currentPage,
        },
      });

      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!report) {
    return (
      <AdminLayout>
        <div className="container py-5 text-center">Loading...</div>
      </AdminLayout>
    );
  }

  //   const filteredOrders =
  //     status === "All Orders"
  //       ? report.recent_orders
  //       : report.recent_orders.filter(
  //           (order) =>
  //             order.status === status
  //         );
  const totalPages = Math.ceil(report.count / 10);
  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        {/* Header */}

        <div className="mb-4">
          <h2 className="fw-bold">Order Report</h2>

          <p className="text-muted mb-0">Order analytics and reporting</p>
        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">
                  <FaClipboardList className="me-2 text-primary" />
                  Total Orders
                </h6>

                <h2 className="fw-bold text-primary">
                  {report.results.total_orders}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Pending Orders</h6>

                <h2 className="fw-bold text-warning">
                  {report.results.pending}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">
                  <FaCheckCircle className="me-2 text-success" />
                  Delivered
                </h6>

                <h2 className="fw-bold text-success">
                  {report.results.delivered}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">
                  <FaTimesCircle className="me-2 text-danger" />
                  Cancelled
                </h6>

                <h2 className="fw-bold text-danger">
                  {report.results.cancelled}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Filter By Status</label>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All Orders</option>

                  <option>Pending</option>

                  <option>Confirmed</option>

                  <option>Processing</option>

                  <option>Delivered</option>

                  <option>Cancelled</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">From Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">To Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons */}

{/* Export Buttons */}

<div className="d-flex justify-content-end gap-2 mb-4">

  <button
    className="btn btn-outline-danger"
    onClick={downloadPDF}
  >
    <FaFilePdf className="me-2" />
    Export PDF
  </button>

  <button
    className="btn btn-outline-success"
    onClick={downloadExcel}
  >
    <FaFileExcel className="me-2" />
    Export Excel
  </button>

</div>
        {/* Orders Table */}

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>

                    <th>Customer</th>

                    <th>Date</th>

                    <th>Status</th>

                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {report.results.recent_orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          to={`/admin/order/${order.id}`}
                          className="
                              badge
                              bg-light
                              text-dark
                              border
                              text-decoration-none
                            "
                        >
                          {order.order_number}
                        </Link>
                      </td>

                      <td>{order.customer}</td>

                      <td>
                        {new Date(order.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td>
                        <span
                          className={
                            order.status === "Pending"
                              ? "badge bg-warning text-dark"
                              : order.status === "Confirmed"
                                ? "badge bg-primary"
                                : order.status === "Processing"
                                  ? "badge bg-info"
                                  : order.status === "Delivered"
                                    ? "badge bg-success"
                                    : "badge bg-danger"
                          }
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>৳{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-secondary me-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`btn me-2 ${
                      currentPage === index + 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="btn btn-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderReport;
