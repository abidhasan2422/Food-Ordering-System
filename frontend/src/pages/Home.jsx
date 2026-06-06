import React from "react";
import PublicLayout from "../components/PublicLayout";
import '../styles/home.css'
// import SearchPage from "../pages/SearchPage";
import { useNavigate } from "react-router-dom";
import  { useState } from "react";
const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
  e.preventDefault();

  navigate(`/search?keyword=${search}`);
};
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
            {/* <input
            //   type="text"
            //   placeholder="Search for food..."
            //    value={search}
            //   onChange={(e) => setSearch(e.target.value)}
            // />

            //  <Link to={`/search?keyword=${search}`}>
            // <button>Search</button>
            // </Link> */}
  <form onSubmit={handleSearch}>
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search food..."
  />

  <button type="submit">
    Search
  </button>
</form>
          </div>
        </div>
      </div>
    </section>
    </PublicLayout>
  );
};

export default Home;