import React from "react";
// import { Link } from "react-router-dom";
import "../styles/layout.css";
import Navbar from "./Navbar";
// import {FaHome, FaSignInAlt, FaTruck, FaUserPlus, FaUserShield, FaUtensils} from 'react-icons/fa'

const PublicLayout = ({ children }) => {
  return (
    <>
    
     
      <Navbar />

     

      <div>
        {children}
      </div>

      <footer className="bg-dark text-light py-4 ">
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