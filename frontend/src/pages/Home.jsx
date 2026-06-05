import React from "react";
import PublicLayout from "../components/PublicLayout";
import '../styles/home.css'
import SearchPage from "../pages/SearchPage";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <PublicLayout>
       <section className="hero-section" style={{  backgroundImage: "url('/images/hero1.jpeg')"}}>
      <div className="overlay">
        <div className="hero-content">
          <h1>Order Delicious Food Online</h1>

          <p>
             Fresh meals, quick delivery, and the best dining experience at your fingertips.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search for food..."
            />

             <Link to="/search">
    <button>Search</button>
  </Link>
          </div>
        </div>
      </div>
    </section>
    </PublicLayout>
  );
};

export default Home;