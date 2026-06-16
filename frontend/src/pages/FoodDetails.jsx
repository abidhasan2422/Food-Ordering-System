import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import axios from "axios";
// import Checkout from './Checkout';


const FoodDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [food, setFood] = useState(null);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        {
          food_id: food.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/cart");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
      .then((res) => res.json())
      .then((data) => setFood(data))
      .catch((err) => console.log(err));
  }, [id]);

  // const addToCart = () => {

  //   const cart = JSON.parse(
  //     localStorage.getItem("cart")
  //   ) || [];

  //   const existingItem = cart.find(
  //     item => item.id === food.id
  //   );

  //   if(existingItem){
  //     existingItem.quantity += 1;
  //   }else{
  //     cart.push({
  //       ...food,
  //       quantity: 1
  //     });
  //   }

  //   localStorage.setItem(
  //     "cart",
  //     JSON.stringify(cart)
  //   );

  //   alert("Added to cart");
  // };

 

const buyNow = () => {
  navigate(
    "/checkout",
    {
      state: {
        food: food,
        quantity: 1
      }
    }
  );
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
                {/* <i className="fas fa-credit-card me-2"></i> */}
                 {/* <i className="fas fa-money-check-alt me-2"></i> */}
                  <i className="fas fa-shopping-bag me-2"></i>
                    {/* <i className="fas fa-utensils me-2"></i> */}

                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetails;
