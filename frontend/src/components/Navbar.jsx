import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaUserShield,
  FaUtensils,
  FaShoppingCart,
  FaBox,
  FaUserCircle, 
  FaUserEdit,
  FaLock,
  FaSignOutAlt,
  FaBoxOpen
} from "react-icons/fa";
import "../styles/layout.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CartContext } from "./CartContext";
import { useEffect, useState, useContext } from "react";
import userApi from "../utils/userApi";

const Navbar = () => {
  const { cartCount  } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const response = await userApi.get("cart/");

      
      } catch (error) {
        console.log(error);
      }
    };

    fetchCartCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };
  const token = localStorage.getItem("access_token");
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        


<a className="navbar-brand d-flex align-items-center" href="/">
  <FaBoxOpen className="text-warning me-2" size={28} />
  <span className="fw-bold text-white">BiteBox</span>
 </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item mx-1">
              <Link className="nav-link active" to="/">
                <FaHome className="me-2" />
                Home
              </Link>
            </li>
           

            {token ? (
              <>
                <li className="nav-item mx-1">
                  {/* <Link className="nav-link" to="/cart"> <FaShoppingCart className="me-2" /> 
                          Cart
                        </Link> */}
                  <Link
                    to="/cart"
                    className="btn btn-outline-light position-relative"
                  >
                    
                    <i className="fas fa-shopping-cart"></i> 

                   {cartCount > 0 && (
  <span
    className="
      position-absolute
      top-0
      start-100
      translate-middle
      badge
      rounded-pill
      bg-danger
    "
  > 
    {cartCount}
  </span>
)}
                  </Link>
                </li>


                 <li className="nav-item mx-1">
              <Link className="nav-link" to="/wishlist">
                {" "}
                <FaRegHeart className="me-2" /> Wishlist
              </Link>
            </li>

                <li className="nav-item mx-1">
  <Link className="nav-link" to="/my-orders">
    <FaBox className="me-2" />
    My Orders
  </Link>
</li>



{/* <li className="nav-item dropdown mx-1"> */}
<li 
      className="nav-item dropdown mx-1" 
      onClick={() => setIsProfileOpen(!isProfileOpen)}
    >

  {/* <button
    className="nav-link dropdown-toggle btn btn-link text-decoration-none border-0 bg-transparent"
    id="profileDropdown"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <FaUserCircle className="me-2" />
    Profile
  </button> */}
  <button
        className="nav-link dropdown-toggle btn btn-link text-decoration-none border-0 bg-transparent"
        id="profileDropdown"
        type="button" // Always add type="button" to React buttons to prevent form submissions
      >
        <FaUserCircle className="me-2" />
        Profile
      </button>
      

  {/* <ul
    className="dropdown-menu dropdown-menu-end"
    aria-labelledby="profileDropdown"
  > */}
  <ul
        className={`dropdown-menu dropdown-menu-end ${isProfileOpen ? "show" : ""}`}
        aria-labelledby="profileDropdown"
      >

    <li>
      <Link className="dropdown-item" to="/profile">
        <FaUserCircle className="me-2" />
        My Profile
      </Link>
    </li>

    <li>
      <Link className="dropdown-item" to="/edit-profile">
        <FaUserEdit className="me-2" />
        Edit Profile
      </Link>
    </li>

    <li>
      <Link className="dropdown-item" to="/change_password">
        <FaLock className="me-2" />
        Change Password
      </Link>
    </li>

    <li><hr className="dropdown-divider" /></li>

    <li>
      <button
        className="dropdown-item text-danger"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </li>

  </ul>

</li>
              </>
            ) : (
              <>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/login">
                    {" "}
                    <FaSignInAlt className="me-2" /> Login
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/admin-login">
                    {" "}
                    <FaUserShield className="me-2" /> AdminLogin
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
