import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,

  FaUserShield,
  FaUtensils,
  FaShoppingCart,
  FaBox,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/layout.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CartContext } from "./CartContext";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

const Navbar = () => {
  const { cartCount  } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //setCartCount(response.data.length);
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

    navigate("/login");
  };
  const token = localStorage.getItem("access_token");
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <FaUtensils className="me-2" />
          Food Ordering System
        </Link>

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
              <Link className="nav-link" to="#">
                {" "}
                <FaRegHeart className="me-2" /> Wishlist
              </Link>
            </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/my-orders">
                    {" "}
                    <FaBox className="me-2" />
                    My Orders
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/profile">
                    {" "}
                    <FaUserCircle className="me-2" />
                    Profile
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
