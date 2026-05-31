import { FaBell, FaSignOutAlt, FaUserCircle, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/admin-login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid">

        {/* Logo */}
        <div className="d-flex align-items-center">
          <FaUtensils
            size={28}
            className="me-2 text-dark"
          />

          <h4 className="mb-0 fw-bold">
            Online Food Ordering System
          </h4>
        </div>

        {/* Right Side */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Notification */}
            <li className="nav-item me-3">
              <button className="btn btn-outline-secondary">
                <FaBell />
              </button>
            </li>

            {/* Admin Profile */}
            {/* <li className="nav-item me-3 d-flex align-items-center">
              <FaUserCircle
                size={35}
                className="me-2 text-primary"
              /> */}

              {/* <span className="fw-semibold">
                Admin
              </span> */}
            {/* </li> */}

            {/* Logout */}
            <li className="nav-item">
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" />
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default AdminHeader;