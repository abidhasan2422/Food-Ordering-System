import React, { useEffect, useState } from "react";
import adminApi from "../utils/adminApi";

import AdminLayout from "../components/AdminLayout";
import {
  FaMoneyBillWave,
  FaCalendarDay,
  FaChartLine,
  FaUtensils,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const SalesReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {

      const response = await adminApi.get(
        "admin/sales-report/");

      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!report) {
    return (
      <AdminLayout>
        <div className="container py-5 text-center">
          <h4>Loading Sales Report...</h4>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid p-4">

        {/* Header */}

        <div className="mb-4">
          <h2 className="fw-bold">
            Sales Report
          </h2>

          <p className="text-muted mb-0">
            Revenue and sales analytics
          </p>
        </div>

        {/* Revenue Cards */}

        <div className="row g-3 mb-4">

          <div className="col-md-3">
           
            <div className="card border-0 shadow-sm">
  <div className="card-body">

    <h6 className="text-muted">
      Total Revenue
    </h6>

    <h2 className="fw-bold text-success">
      ৳{report.total_revenue}
    </h2>

    <small
      className={
        report.revenue_growth >= 0
          ? "text-success"
          : "text-danger"
      }
    >
      {report.revenue_growth >= 0
        ? "↑"
        : "↓"}
      {" "}
      {Math.abs(report.revenue_growth)}%
      this week
    </small>

  </div>
</div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">

                <h6 className="text-muted">
                  <FaCalendarDay
                    className="me-2 text-primary"
                  />
                  Today Revenue
                </h6>

                <h2 className="fw-bold text-primary">
                
                  {report.today_revenue > 0 ? `৳${report.today_revenue}` : "No Sales"}
                </h2>

              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">

                <h6 className="text-muted">
                  <FaChartLine
                    className="me-2 text-warning"
                  />
                  Monthly Revenue
                </h6>

                <h2 className="fw-bold text-warning">
                  ৳{report.monthly_revenue}
                </h2>

              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">

                <h6 className="text-muted">
                  Average Order
                </h6>

                <h2 className="fw-bold text-info">
                  ৳{report.average_order}
                </h2>

              </div>
            </div>
          </div>

        </div>

        {/* Revenue Chart */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <h5 className="fw-bold mb-4">
              Revenue Trend
            </h5>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={report.revenue_chart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                />

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

        <div className="row">

          {/* Top Selling Foods */}

          <div className="col-lg-6 mb-4">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h5 className="fw-bold mb-3">
                  <FaUtensils className="me-2" />
                  Top Selling Foods
                </h5>

                {report.top_foods.length === 0 ? (

                  <p className="text-muted">
                    No sales yet.
                  </p>

                ) : (

                  report.top_foods.map(
                    (food, index) => (

                      <div
                        key={index}
                        className="
                          d-flex
                          justify-content-between
                          align-items-center
                          border-bottom
                          py-2
                        "
                      >

                        {/* <div>

                          <span className="fw-bold me-2">
                            #{index + 1}
                          </span>

                          {food.food__item_name}

                        </div> */}
                        <div className="d-flex justify-content-between align-items-center">

  <div>

    <span
      className={
        index === 0
          ? "badge bg-warning text-dark me-2"
          : index === 1
          ? "badge bg-secondary me-2"
          : index === 2
          ? "badge bg-danger me-2"
          : "badge bg-dark me-2"
      }
    >
      #{index + 1}
    </span>

    <span className="fw-semibold">
      {food.food__item_name}
    </span>

  </div>

  

</div>

                        <span className="badge bg-success">
                          {food.total_sold} Sold
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

          {/* Recent Sales */}

          <div className="col-lg-6 mb-4">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h5 className="fw-bold mb-3">
                  Recent Sales
                </h5>

                <div className="table-responsive">

                  <table className="table table-hover">

                    <thead className="table-dark">

                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                      </tr>

                    </thead>

                    <tbody>

                      {report.recent_sales.map(
                        (sale) => (

                          <tr key={sale.id}>

                            <td>
                              {sale.order_number}
                            </td>

                            <td>
                              {sale.full_name}
                            </td>

                            <td>
                              ৳{sale.total_amount}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default SalesReport;