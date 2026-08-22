import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import userApi from "../utils/userApi";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { toast, ToastContainer } from "react-toastify";

const FoodDetails = () => {
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [food, setFood] = useState(null);

  const addToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.info("Please login to add items to your cart.", {
        autoClose: 1500,
        onClose: () => navigate("/login"),
      });

      return;
    }

    try {
      await userApi.post("cart/add/", {
        food_id: food.id,
      });

      await fetchCartCount();

      toast.success("Item added to cart successfully!", {
        autoClose: 1000,
        onClose: () => navigate("/cart"),
      });
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to add item to cart.");
    }
  };

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await userApi.get(`foods/${id}/`);

        setFood(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [id]);

  const buyNow = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.info("Please login to continue with your purchase.", {
        autoClose: 1500,
        onClose: () => navigate("/login"),
      });

      return;
    }

    navigate("/checkout", {
      state: {
        food,
        quantity: 1,
      },
    });
  };
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
              src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${food.image}`}
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
            <h1 className="fw-bold mb-3">{food.item_name}</h1>

            {food.is_available ? (
              <span className="badge bg-success mb-3">Available</span>
            ) : (
              <span className="badge bg-danger mb-3">Out of Stock</span>
            )}

            <p className="mb-3">
              <span className="fw-bold text-primary">Category:</span>

              <span className="badge bg-info ms-2">{food.category_name}</span>
            </p>

            <h2 className="text-success fw-bold mb-3">৳{food.item_price}</h2>

            <p className="fs-5 mb-4">
              <span className="text-primary fw-bold">Description:</span>{" "}
              <span className="text-muted">{food.item_description}</span>
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                Back
              </button>

              <button className="btn btn-warning px-4" onClick={addToCart}>
                <i className="fas fa-shopping-cart me-2"></i>
                Add to Cart
              </button>

              <button className="btn btn-success px-4" onClick={buyNow}>
                <i className="fas fa-shopping-bag me-2"></i>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </PublicLayout>
  );
};

export default FoodDetails;
