import React from "react";
import PublicLayout from "../components/PublicLayout";
import '../styles/home.css'
import { useNavigate } from "react-router-dom";
import  { useState,useEffect } from "react";
import { FaHamburger, FaMapMarkerAlt, FaShippingFast,FaShoppingBasket } from "react-icons/fa";
import FoodCard from "../components/FoodCard";
import api from "../utils/userApi";

const Home = () => {
  const navigate = useNavigate();

const [foods, setFoods] = useState([]);

useEffect(() => {
  fetch(
   api.get("random-foods/")
  )
    .then((response) =>
      response.json()
    )
    .then((data) => {
      setFoods(data);
    });
}, []);

  return (
    <PublicLayout>
   

<section className="hero-section container-fluid">

  <div
    className="row align-items-center hero-box"
    style={{
      backgroundImage: "url('/images/hero.jpg')",
    }}
  >

   
    <div className="hero-overlay"></div>

    <div className="col-lg-6 hero-content">

      <span className="badge bg-warning text-dark mb-3">
        Fresh & Delicious
      </span>

      <h1 className="display-3 fw-bold text-white">
        Order Your Favourite Food Here
      </h1>

      <p className="text-white mt-4">
        Choose from our delicious menu featuring burgers,
        pizza, pasta, drinks and much more.
        Fresh ingredients and fast delivery at your doorstep.
      </p>

      <button
        className="btn rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 btn-hero mb-4"
        onClick={() => navigate("/menu")}
      >
        <FaShoppingBasket /> Browse Menu
      </button>

    </div>

  </div>

</section>

    
 <section className="container-fluid pt-4">
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
        <FaHamburger className="text-warning mb-3" size={35} />
        <h4> Choose Your Meal</h4>
        <p>
          Browse our menu and select your favorite food from a wide range of dishes.
        </p>
      </div>

      <div className="col-md-4 mb-4">
        <FaMapMarkerAlt className="text-warning mb-3" size={35} />
        <h4> Add Delivery Address</h4>
        <p>
          Enter your location and we'll make sure your order reaches you quickly.
        </p>
      </div>

      <div className="col-md-4 mb-4">
         <FaShippingFast className="text-warning mb-3" size={35} />
        <h4> Fast Delivery</h4>
        <p>
          Relax and enjoy while our delivery partners bring your meal to your doorstep.
        </p>
      </div>
    </div>
  </div>

 
  <section className="py-5 bg-warning text-center text-dark position-relative">

<div id="offerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000" data-bs-pause="false" data-bs-wrap="true">    <div className="carousel-inner container">

      {/* Slide 1: 10% Off Offer */}
      <div className="carousel-item active">
        <h3 className="fw-bold mb-3">
          Craving Something Specific?
        </h3>
        <h5 className="mb-4 text-dark">
          Get <span className="bg-white px-2 py-1 rounded text-danger fw-bold">10% OFF</span> your first order!
        </h5>
        <button
          className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow"
          onClick={() => navigate("/menu")}
        >
          Claim Your Discount
        </button>
      </div>

      {/* Slide 2: Free Delivery Offer */}
      <div className="carousel-item">
        <h3 className="fw-bold mb-3">
          Feast with Friends & Family
        </h3>
        <h5 className="mb-4 text-dark">
          Enjoy <span className="bg-white px-2 py-1 rounded text-danger fw-bold">Free Delivery</span> on orders over ৳1,000!
        </h5>
        <button
          className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow"
          onClick={() => navigate("/menu")}
        >
          Order Now
        </button>
      </div>

    </div>

    {/* Navigation Arrows (Optional, but good for user control) */}
    <button className="carousel-control-prev" type="button" data-bs-target="#offerCarousel" data-bs-slide="prev" style={{ width: "5%" }}>
      <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: "invert(1)" }}></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#offerCarousel" data-bs-slide="next" style={{ width: "5%" }}>
      <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: "invert(1)" }}></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</section>
</section>

    </PublicLayout>
    
  );
};

export default Home;