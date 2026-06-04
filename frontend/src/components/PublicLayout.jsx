import React from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";
import {FaHome, FaSignInAlt, FaTruck, FaUserPlus, FaUserShield, FaUtensils} from 'react-icons/fa'
const PublicLayout = ({ children }) => {
  return (
    <>
      <nav>
     
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    <Link className="navbar-brand fw-bold" to="#"> <FaUtensils className='me-2'/>Food Ordering System</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item mx-1" >
          <Link className="nav-link active" to="#"><FaHome className='me-2'/>Home</Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link" to="#"> <FaTruck className='me-2'/> Track</Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link" to="#"> <FaUserPlus className='me-2'/> Register</Link>
        </li>
      
        <li className="nav-item mx-1">
          <Link className="nav-link" to="#"> <FaSignInAlt className='me-2'/> Login</Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link" to="#"> <FaUserShield className='me-2'/> AdminLogin</Link>
        </li>
       
      </ul>
     
    </div>
  </div>
</nav>

      </nav>

      <div className="container mt-4">
        {children}
      </div>

      <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">

          <div className="col-md-4 mb-3">
            <h5>Food Ordering System</h5>
            <p>
              Order your favorite food online quickly and easily.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">PublicLayout</a></li>
              <li><a href="/foods" className="text-light text-decoration-none">Foods</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p>Email:likhon123@gmail.com </p>
            <p>Phone: +880 0130-7082551</p>
          </div>

        </div>

        <hr />

        <div className="text-center">
          <p className="mb-0">
            © 2026 Food Ordering System. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
        

    </>
  );
};

export default PublicLayout;