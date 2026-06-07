import React from "react";
import PublicLayout from "../components/PublicLayout";
import '../styles/home.css'
// import SearchPage from "../pages/SearchPage";
import { useNavigate } from "react-router-dom";
import  { useState,useEffect } from "react";
const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
const [foods, setFoods] = useState([]);

useEffect(() => {
  fetch(
    "http://127.0.0.1:8000/api/random-foods/"
  )
    .then((response) =>
      response.json()
    )
    .then((data) => {
      setFoods(data);
    });
}, []);

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
    <section className="container py-5">
  <h2 className="text-center mb-5">
    Most Popular Dishes This Month
  </h2>

  <div className="row">
    {foods.map((food) => (
      <div
        className="col-md-4 mb-4"
        key={food.id}
      >
        <div className="food-card">

          <img
            src={`http://127.0.0.1:8000${food.image}`}
            alt={food.item_name}
            className="food-image"
          />

          <div className="food-body">

            <h5 className="food-title">
              {food.item_name}
            </h5>

            <p className="food-description">
              {food.item_description}
            </p>

            <p className="food-price">
              ৳{food.item_price}
            </p>
            <p>
              {food.is_available ? (

                      <span className="badge bg-success">
                        OrderNow
                      </span>

                    ) : (

                      <span className="badge bg-danger">
                        Unavailable
                      </span>

                    )}
            </p>

          </div>

        </div>
      </div>
    ))}
  </div>
</section>

    </PublicLayout>
    
  );
};

export default Home;