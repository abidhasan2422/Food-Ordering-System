import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
      .then((res) => res.json())
      .then((data) => setFood(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!food) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <PublicLayout>
      <div className="container py-5">
        <div className="row bg-white shadow rounded overflow-hidden">

          {/* Food Image */}
          <div className="col-md-5 p-0">
            <img
              src={`http://127.0.0.1:8000${food.image}`}
              alt={food.item_name}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                minHeight: "450px",
              }}
            />
          </div>

          {/* Food Details */}
          <div className="col-md-7 p-5">
            <h1 className="fw-bold mb-3">
              {food.item_name}
            </h1>

            {food.is_available ? (
              <span className="badge bg-success mb-3">
                Available
              </span>
            ) : (
              <span className="badge bg-danger mb-3">
                Out of Stock
              </span>
            )}

            <p className="mb-3">
              <span className="fw-bold text-primary">
                Category:
              </span>

              <span className="badge bg-info ms-2">
                {food.category_name}
              </span>
            </p>

            <h2 className="text-success fw-bold mb-3">
              ৳{food.item_price}
            </h2>

            <p className="text-muted fs-5 mb-4">
              {food.item_description}
            </p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                Back
              </button>

              <button className="btn btn-warning px-4">
                <i className="fas fa-shopping-cart me-2"></i>
                Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetails;