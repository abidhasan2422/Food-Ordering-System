import React, { useEffect, useState } from "react";
import api from "../utils/adminApi";

import AdminLayout from "../components/AdminLayout";
import { FaSearch, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      //const token = localStorage.getItem("admin_access");

      const response = await api.get(
        "admin/customers/",
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      setCustomers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      customer.email.toLowerCase().includes(search.toLowerCase().trim()) ||
      customer.phone.includes(search.trim())
  );

  return (
    <AdminLayout>
      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold mb-1">
              Customers Management
            </h2>

            <p className="text-muted mb-0">
              Manage all registered customers
            </p>
          </div>

          <div className="badge bg-dark fs-6 p-3">
            <FaUsers className="me-2" />
            Total Customers: {customers.length}
          </div>

        </div>

        {/* Search */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <div className="input-group">

              <span className="input-group-text">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, Email or Phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

        </div>

        {/* Table */}

        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-dark">

                  <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Joined Date</th>
                    <th width="120">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-4"
                      >
                        No Customers Found
                      </td>

                    </tr>

                  ) : (

                    filteredCustomers.map((customer) => (

                      <tr key={customer.id}>

                        <td>
                          <span className="fw-bold text-primary">
                            CU-{String(customer.id).padStart(5, "0")}
                          </span>
                        </td>

                        <td>
                          {customer.name}
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone}
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {customer.total_orders}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            customer.join_date
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td>

                          <Link
                            to={`/admin/customers/${customer.id}`}
                            className="badge rounded-pill bg-primary-subtle text-primary border text-decoration-none px-3 py-2"
                          >
                            {/* <FaEye className="me-1" /> */}
                            View
                          </Link>

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
  );
};

export default Customers;