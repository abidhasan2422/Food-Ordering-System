import { Link } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaTruck,
  FaUserPlus,
  FaUserShield,
  FaUtensils
} from "react-icons/fa";
import "../styles/layout.css";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <FaUtensils className="me-2" />
          Food Ordering System
        </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item mx-1" >
                      <Link className="nav-link active" to="/"><FaHome className='me-2'/>Home</Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="#"> <FaTruck className='me-2'/> Track</Link>
                    </li>
                    {/* <li className="nav-item mx-1">
                      <Link className="nav-link" to="/register"> <FaUserPlus className='me-2'/> Register</Link>
                    </li> */}
                  
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="#"> <FaSignInAlt className='me-2'/> Login</Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/admin-login"> <FaUserShield className='me-2'/> AdminLogin</Link>
                    </li>
                   
                  </ul>
                 
                </div>
              
      </div>
    </nav>
  );
};

export default Navbar;