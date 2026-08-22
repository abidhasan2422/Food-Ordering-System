import React, { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import { FaSearch, FaTimes } from "react-icons/fa";
import userApi from "../utils/userApi";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoverClear, setHoverClear] = useState(false);

  const [sortBy, setSortBy] = useState("Default");
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchMenu = async () => {
    try {
     const response = await userApi.get("menu/");

    setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const totalResults = useMemo(() => {
    return categories.reduce((total, category) => {
      const foods = category.foods.filter(
        (food) =>
          food.item_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          category.category_name
            .toLowerCase()
            .includes(search.toLowerCase())
      );

      return total + foods.length;
    }, 0);
  }, [categories, search]);

  const hasFood = totalResults > 0;



  const resetFilters = () => {

    setSearch("");

    setSortBy("Default");

    setAvailableOnly(false);

    setSelectedCategory("All");

  };

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

        <div
          className="sticky-top bg-white py-4 mb-5 rounded-4 shadow"
          style={{
            zIndex: 1000,
            border: "1px solid #eee",
          }}
        >

          {/* Search */}

          <div className="position-relative mb-3">

            <FaSearch
              className="position-absolute text-secondary"
              style={{
                top: "50%",
                left: "18px",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            />

            <input
              type="text"
              className="form-control ps-5 pe-5"
              placeholder="Search burgers, pizza, drinks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                height: "55px",
                borderRadius: "30px",
                fontSize: "16px",
              }}
            />

            {search && (
              <FaTimes
                onMouseEnter={() =>
                  setHoverClear(true)
                }
                onMouseLeave={() =>
                  setHoverClear(false)
                }
                onClick={() =>
                  setSearch("")
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "18px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: hoverClear
                    ? "#dc3545"
                    : "#6c757d",
                  transition: "0.2s",
                }}
              />
            )}

          </div>

          {search && (
            <div className="d-flex justify-content-between align-items-center mb-3">

              <p
                className="text-muted mb-0"
                style={{
                  fontSize: "15px",
                }}
              >
                Showing
                {" "}
                <strong>
                  {totalResults}
                </strong>
                {" "}
                {totalResults === 1
                  ? "item"
                  : "items"}
                {" "}
                matching
                {" "}
                <strong>
                  "{search}"
                </strong>
              </p>

           

            </div>
          )}

          {/* Filters */}

          <div className="row g-3 mb-4">
            <div className="col-md-4">

  <label className="form-label fw-semibold">
    Category
  </label>

  <select
    className="form-select"
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(e.target.value)
    }
  >

    <option value="All">
      All Categories
    </option>

    {categories.map((category) => (
        

      <option
        key={category.id}
        value={category.category_name}
      >
        {category.category_name}
      </option>

    ))}

  </select>

</div>

            <div className="col-md-4">

              <label className="form-label fw-semibold">
                Sort By
              </label>

              <select
                className="form-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
              >

                <option>
                  Default
                </option>

                <option>
                  Price Low to High
                </option>

                <option>
                  Price High to Low
                </option>

                <option>
                  A-Z
                </option>

                <option>
                  Z-A
                </option>

              </select>

            </div>

            <div className="col-md-4 d-flex align-items-end">

              <div className="form-check">

                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={availableOnly}
                  onChange={(e) =>
                    setAvailableOnly(
                      e.target.checked
                    )
                  }
                />

                <label className="form-check-label fw-semibold">
                  Available Only
                </label>

              </div>

            </div>

          </div>

    

        </div>

                {/* Menu */}

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

            <button
              className="btn btn-primary mt-3"
              onClick={resetFilters}
            >
              Show All Foods
            </button>

          </div>

        ) : (

          categories.map((category) => {
            if (
  selectedCategory !== "All" &&
  category.category_name !== selectedCategory
) {
  return null;
}

            let filteredFoods = category.foods.filter(
              (food) =>
                food.item_name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||

                category.category_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            );

            // Available Only

            if (availableOnly) {

              filteredFoods = filteredFoods.filter(
                (food) => food.is_available
              );

            }

            // Sorting

            if (sortBy === "Price Low to High") {

              filteredFoods.sort(
                (a, b) =>
                  Number(a.item_price) -
                  Number(b.item_price)
              );

            }

            if (sortBy === "Price High to Low") {

              filteredFoods.sort(
                (a, b) =>
                  Number(b.item_price) -
                  Number(a.item_price)
              );

            }

            if (sortBy === "A-Z") {

              filteredFoods.sort(
                (a, b) =>
                  a.item_name.localeCompare(
                    b.item_name
                  )
              );

            }

            if (sortBy === "Z-A") {

              filteredFoods.sort(
                (a, b) =>
                  b.item_name.localeCompare(
                    a.item_name
                  )
              );

            }

            if (filteredFoods.length === 0) {

              return null;

            }

            return (

              <div
                key={category.id}
                id={`category-${category.id}`}
                className="mb-5"
                style={{
                  scrollMarginTop: "140px",
                }}
              >

                <h3
                  className="fw-bold mb-4"
                  style={{
                    color: "#0d6efd",
                    borderLeft:
                      "5px solid #0d6efd",
                    paddingLeft: "12px",
                  }}
                >
                  {category.category_name}
                </h3>

                <div className="row g-4 justify-content-center">

                  {filteredFoods.map((food) => (

                    <div
                      key={food.id}
                      className="col-lg-4 col-md-6"
                    >

                      <FoodCard
                        food={food}
                      />

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