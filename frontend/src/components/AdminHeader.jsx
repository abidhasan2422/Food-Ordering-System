import { FaBell, FaSignOutAlt,  FaBars, FaUtensils,FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

  // Remove admin authentication data
  localStorage.removeItem("admin_access");
  localStorage.removeItem("admin_refresh");

  // (Optional) Remove admin info if you store it
  localStorage.removeItem("admin");

  // Redirect to login page
  navigate("/admin-login", { replace: true });

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
       <a className="navbar-brand d-flex align-items-center" href="/admin-dashboard">
         <FaBoxOpen className="text-warning me-2" size={28} />
         <span className="fw-bold text-dark">BiteBox</span>
        </a>

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