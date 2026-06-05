import React, { useState } from "react";
import '../styles/search.css'

const SearchPage = () => {
  const [search, setSearch] = useState("");

  const foods = [
    {
      id: 1,
      name: "Burger",
      price: 250,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      name: "Pizza",
      price: 500,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      name: "Pasta",
      price: 350,
      image: "https://via.placeholder.com/300x200",
    },
  ];

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Search Foods</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-warning">
          Search
        </button>
      </div>

      <h5 className="mb-4">
        Showing {filteredFoods.length} results
      </h5>

      <div className="row">
        {filteredFoods.map((food) => (
          <div
            className="col-md-4 mb-4"
            key={food.id}
          >
            <div className="card h-100 shadow-sm food-card">
              <img
                src={food.image}
                className="card-img-top"
                alt={food.name}
              />

              <div className="card-body">
                <h5 className="card-title">
                  {food.name}
                </h5>

                <p className="card-text">
                  Price: ৳{food.price}
                </p>

                <button className="btn btn-warning w-100">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;