import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaHamburger,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaList,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div
      className="bg-dark text-white vh-100 p-3"
      style={{ width: "260px" }}
    >
     <div className="text-center mb-4">
  <img
    src="/images/admin.jpg"
    alt="Admin"
    className="rounded-circle border border-light"
    style={{
      width: "90px",
      height: "90px",
      objectFit: "cover",
    }}
  />

  <h5 className="mt-3 mb-1">Admin</h5>

  <small className="text-secondary">
    Administrator
  </small>
</div>

<hr className="text-secondary" />



      {/* Dashboard */}
      <div className="mb-2">
        <Link
          to="/admin-dashboard"
          className="btn text-white w-100 text-start"
        >
          <FaTachometerAlt className="me-2" />
          Dashboard
        </Link>
      </div>

      {/* Users */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("users")}
        >
          <FaUsers className="me-2" />
          Users

          <span className="float-end">
            {openMenu === "users" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "users" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/customers"
              className="text-white text-decoration-none mb-2"
            >
              Customers
            </Link>

            <Link
              to="/admin/delivery-boys"
              className="text-white text-decoration-none"
            >
              Delivery Boys
            </Link>
          </div>
        )}
      </div>

      {/* Food Categories */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("categories")}
        >
          <FaList className="me-2" />
          Food Categories

          <span className="float-end">
            {openMenu === "categories" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "categories" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/category/add"
              className="text-white text-decoration-none mb-2"
            >
              Add Category
            </Link>

            <Link
              to="/admin/category/manage"
              className="text-white text-decoration-none"
            >
             Manage Category 
            </Link>
          </div>
        )}
      </div>

      {/* Foods */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("foods")}
        >
          <FaHamburger className="me-2" />
          Foods

          <span className="float-end">
            {openMenu === "foods" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "foods" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/food/add"
              className="text-white text-decoration-none mb-2"
            >
              Add Food Item
            </Link>

            <Link
              to="/admin/food/manage"
              className="text-white text-decoration-none"
            >
              Manage Food Item
            </Link>
          </div>
        )}
      </div>

      {/* Restaurants */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("restaurants")}
        >
          <FaStore className="me-2" />
          Restaurants

          <span className="float-end">
            {openMenu === "restaurants" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "restaurants" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/restaurant/add"
              className="text-white text-decoration-none mb-2"
            >
              Add Restaurant
            </Link>

            <Link
              to="/admin/restaurant/list"
              className="text-white text-decoration-none mb-2"
            >
              Restaurant List
            </Link>

            <Link
              to="/admin/restaurant/manage"
              className="text-white text-decoration-none"
            >
              Manage Restaurant 
            </Link>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("orders")}
        >
          <FaShoppingCart className="me-2" />
          Orders

          <span className="float-end">
            {openMenu === "orders" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "orders" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/orders/pending"
              className="text-white text-decoration-none mb-2"
            >
              Pending Orders
            </Link>

            <Link
              to="/admin/orders/processing"
              className="text-white text-decoration-none mb-2"
            >
              Processing Orders
            </Link>

            <Link
              to="/admin/orders/completed"
              className="text-white text-decoration-none"
            >
              Completed Orders
            </Link>
          </div>
        )}
      </div>

      {/* Reports */}
      <div className="mb-2">
        <button
          className="btn text-white w-100 text-start"
          onClick={() => toggleMenu("reports")}
        >
          <FaChartBar className="me-2" />
          Reports

          <span className="float-end">
            {openMenu === "reports" ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}
          </span>
        </button>

        {openMenu === "reports" && (
          <div className="ms-4 mt-2 d-flex flex-column">
            <Link
              to="/admin/reports/sales"
              className="text-white text-decoration-none mb-2"
            >
              Sales Report
            </Link>

            <Link
              to="/admin/reports/orders"
              className="text-white text-decoration-none"
            >
              Order Report
            </Link>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="mt-2">
        <Link
          to="/admin/settings"
          className="btn text-white w-100 text-start"
        >
          <FaCog className="me-2" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;