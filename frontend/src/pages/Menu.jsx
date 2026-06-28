import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";

const Menu = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <h2 className="fw-bold text-center mb-5">
          Browse Our Menu
        </h2>
        <div
    className="sticky-top bg-white py-3 mb-5 shadow-sm"
    style={{ zIndex: 1000 }}
>

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
                        .scrollIntoView({
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
        {categories.map((category) => (

         <div
    key={category.id}
    id={`category-${category.id}`}
    className="mb-5"
>

            <h3 className="fw-bold border-bottom pb-2 mb-4">
              {category.category_name}
            </h3>

            <div className="row">

              {category.foods.length > 0 ? (

                category.foods.map((food) => (

                  <div
                    className="col-lg-4 col-md-6 mb-4"
                    key={food.id}
                  >

                    <FoodCard food={food} />

                  </div>

                ))

              ) : (

                <div className="col-12">

                  <p className="text-muted">
                    No food available in this category.
                  </p>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>
    </>
  );
};

export default Menu;