import React from "react";
import PublicLayout from "../components/PublicLayout";
import '../styles/home.css'
import { useNavigate ,Link } from "react-router-dom";
import  { useState,useEffect } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import FoodCard from "../components/FoodCard";
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
        className="col-lg-3 col-md-4 col-sm-6 mb-4"
        key={food.id}
      >
        <FoodCard food={food} />
      </div>
    ))}
  </div>
</section>
<section className="bg-dark text-white py-5">
  <div className="container">
    <h2 className="text-center fw-bold mb-5">
      How It Works
    </h2>

    <div className="row text-center">
      <div className="col-md-4 mb-4">
        <h4>🍔 Choose Your Meal</h4>
        <p>
          Browse our menu and select your favorite food from a wide range of dishes.
        </p>
      </div>

      <div className="col-md-4 mb-4">
        <h4>📍 Add Delivery Address</h4>
        <p>
          Enter your location and we'll make sure your order reaches you quickly.
        </p>
      </div>

      <div className="col-md-4 mb-4">
        <h4>🚚 Fast Delivery</h4>
        <p>
          Relax and enjoy while our delivery partners bring your meal to your doorstep.
        </p>
      </div>
    </div>
  </div>

  <section className="py-5 bg-warning text-center text-dark">
    <h4 className="fw-bold">
      Ready to Order Your Favorite Food?
    </h4>

    {/* <Link to="/foods" className="btn btn-dark btn-lg mt-3">
      Browse Full Menu
    </Link> */}
    <button
    className="btn btn-dark"
    onClick={() => navigate("/menu")}
>
    Browse Full Menu
</button>
  </section>
</section>

    </PublicLayout>
    
  );
};

export default Home;