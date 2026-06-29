import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import { FaSearch, FaTimes } from "react-icons/fa";


const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState(null);
const [hoverClear, setHoverClear] = useState(false);
  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/menu/"
      );

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);
const hasFood = categories.some((category) =>
  category.foods.some((food) =>
    food.item_name
      .toLowerCase()
      .includes(search.toLowerCase())
  )
);


const totalResults = categories.reduce((total, category) => {

  const filteredFoods = category.foods.filter((food) =>
    food.item_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return total + filteredFoods.length;

}, 0);

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <h2 className="fw-bold text-center mb-2">
    Browse Our Menu
</h2>

<p className="text-center text-muted mb-5">
    Explore delicious foods by category
</p>

        {/* Sticky Search & Category Buttons */}

       <div
  className="sticky-top bg-white py-4 mb-5 rounded-4 shadow"
  style={{
    zIndex: 1000,
    border: "1px solid #eee",
  }}
>

<div className="position-relative mb-3">

  {/* Search Icon */}
  <FaSearch
    className="position-absolute text-secondary"
    style={{
      top: "50%",
      left: "15px",
      transform: "translateY(-50%)",
      zIndex: 2,
    }}
  />

  {/* Input */}
  <input
    type="text"
    className="form-control ps-5 pe-5"
    placeholder="Search your favourite food..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      height: "55px",
      lineHeight: "55px",
      borderRadius: "30px",
      fontSize: "17px",
    }}
  />

  {/* Clear Button */}
  {search && (
    <FaTimes
      onMouseEnter={() => setHoverClear(true)}
      onMouseLeave={() => setHoverClear(false)}
      onClick={() => setSearch("")}
      style={{
        position: "absolute",
        top: "50%",
        right: "18px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "16px",
        color: hoverClear ? "#dc3545" : "#6c757d",
        transition: "0.2s",
      }}
    />
  )}

</div>

{/* Search Result Count */}
{search && (
  <p
    className="text-muted mb-3"
    style={{ fontSize: "15px" }}
  >
    {/* <FaSearch className="me-2 text-primary" /> */}

    Showing <strong>{totalResults}</strong>{" "}
    {totalResults === 1 ? "item" : "items"} matching{" "}
    <strong>"{search}"</strong>
  </p>
)}

          <div className="d-flex flex-wrap gap-2">

            {categories.map((category) => (

            <button
  key={category.id}
  className={`btn rounded-pill px-4 py-2 shadow-sm ${
    activeCategory === category.id
      ? "btn-primary"
      : "btn-outline-primary"
  }`}
  style={{
    transition: "all 0.3s ease",
    transform:
      activeCategory === category.id
        ? "translateY(-2px)"
        : "translateY(0)",
  }}
  onClick={() => {
    setActiveCategory(category.id);

    document
      .getElementById(`category-${category.id}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }}
>
  {category.category_name}
</button>

            ))}

          </div>

        </div>

      {/* Categories */}

{!hasFood ? (


<div className="text-center py-5">

  <img
    src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
    alt="No Food"
    style={{
      width: "130px",
      opacity: 0.8,
    }}
  />

  <h3 className="fw-bold mt-4">
    No Food Found
  </h3>

  <p className="text-muted">
    We couldn't find any food matching
    <strong> "{search}" </strong>
  </p>

</div>

) : (

  categories.map((category) => {

    const filteredFoods = category.foods.filter((food) =>
      food.item_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
 

    if (filteredFoods.length === 0) return null;

    return (

      <div
        key={category.id}
        id={`category-${category.id}`}
        className="mb-5"
      >

        <h3
  className="fw-bold mb-4"
  style={{
    color: "#0d6efd",
    borderLeft: "5px solid #0d6efd",
    paddingLeft: "12px",
  }}
>
          {category.category_name}
        </h3>

       <div className="row justify-content-center">

          {filteredFoods.map((food) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={food.id}
            >
              <FoodCard food={food} />
            </div>

          ))}

        </div>

      </div>

    );

  })

)}

      </div>
    </>
  );
};

export default Menu;