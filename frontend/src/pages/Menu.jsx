import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

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
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <h2 className="fw-bold text-center mb-5">
          Browse Our Menu
        </h2>

        {/* Sticky Search & Category Buttons */}

        <div
          className="sticky-top bg-white py-3 mb-5 shadow-sm"
          style={{ zIndex: 1000 }}
        >

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="d-flex flex-wrap gap-2">

            {categories.map((category) => (

              <button
                key={category.id}
                className="btn btn-outline-dark rounded-pill"
                onClick={() => {

                  document
                    .getElementById(
                      `category-${category.id}`
                    )
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

    <h4 className="text-muted">
      No food found.
    </h4>

    <p className="text-secondary">
      Try searching with another keyword.
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

        <h3 className="fw-bold border-bottom pb-2 mb-4">
          {category.category_name}
        </h3>

        <div className="row">

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