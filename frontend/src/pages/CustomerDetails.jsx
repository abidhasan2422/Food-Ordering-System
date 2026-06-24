import React, { useEffect, useState } from "react";
import api from "../utils/adminApi";

import { useParams, Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { FaShoppingBag, FaMoneyBillWave, FaSearch} from "react-icons/fa";
const CustomerDetails = () => {
  const { id } = useParams();
const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
     // const token = localStorage.getItem("admin_access");

      const response = await api.get(
        `admin/customers/${id}/`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // },
      );

      setCustomer(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  if (!customer) {
    return <div className="container py-5 text-center">Loading...</div>;
  }
    const filteredOrders =
  customer.orders.filter(
    (order) =>
      order.order_number
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Customer Details</h2>

          <Link to="/admin/customers" className="btn btn-dark">
            Back
          </Link>
        </div>
        {/* Customer Info & Avatar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="text-center mb-4">
              <div
                className="
          bg-primary
          text-white
          rounded-circle
          d-inline-flex
          justify-content-center
          align-items-center
          shadow
        "
                style={{
                  width: "90px",
                  //height: "90px",
                  //fontSize: "32px",
                  fontWeight: "bold",
                  width: "110px",
                  height: "110px",
                  fontSize: "40px",
                }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <h4 className="mt-3 mb-1 fw-bold"> {customer.name}</h4>

              <span className="badge bg-light text-dark border">
                Customer ID: CU-{String(customer.id).padStart(5, "0")}
              </span>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-4">
                <p>
                  <strong>Email:</strong>
                  <br />
                  {customer.email}
                </p>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>Phone:</strong>
                  <br />
                  {customer.phone}
                </p>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>Joined:</strong>
                  <br />
                  {new Date(customer.join_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted"
                
                >
                  {" "}
                  <FaShoppingBag className="me-2" />
                  Total Orders
                </h6>

                <h2 className="fw-bold text-primary"
                 style={{
    cursor: "pointer",
  }}    
  onClick={() => {
    document
      .getElementById("order-history")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
                >
                  {customer.total_orders}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">
                  {" "}
                  <FaMoneyBillWave className="me-2" />
                  Total Spending
                </h6>

                <h2 className="fw-bold text-success">
                  ৳{customer.total_spending}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}

        <div 
         id="order-history"
        className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="mb-3">Order History</h4>

            <div className="table-responsive">
                <div className="mb-3">

  {/* <input
    type="text"
    className="form-control"
    placeholder="Search Order ID..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  /> */}
  <div className="input-group mb-3">

  <span className="input-group-text">
    <FaSearch />
  </span>

  <input
    type="text"
    className="form-control"
    placeholder="Search Order ID..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

</div>

</div>
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
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

                        <td>৳{order.total_amount}</td>
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
  );
};

export default CustomerDetails;
