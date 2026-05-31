import { FaBell, FaSignOutAlt,  FaBars, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("isAdminLoggedIn");

    navigate("/admin-login");
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid">
         {/* Mobile Sidebar Button */}
        <button
          className="btn btn-dark d-lg-none me-3"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>

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