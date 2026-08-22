import React, { useEffect, useState,  useContext, } from "react";
import userApi from "../utils/userApi";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { CartContext }
from "../components/CartContext";

const Cart = () => {
  const { fetchCartCount } = useContext(CartContext);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await userApi.get("cart/");

      setCart(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = async (id) => {
    try {
      await userApi.patch(
        `cart/increase/${id}/`,
        {},
        
      );
      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQty = async (id) => {
    try {
      await userApi.patch(
        `cart/decrease/${id}/`,
        {},
        
      );
     fetchCart();
fetchCartCount();
      
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await userApi.delete(`cart/remove/${id}/`, 
        
      );
      fetchCart();
fetchCartCount();
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.item_price) * item.quantity,
    0,
  );

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4">Shopping Cart</h2>

        <div className="card shadow border-0">
          <div className="card-body">
            {cart.length === 0 && (
              <div className="alert alert-info text-center">
                <h5>Your cart is empty</h5>

                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate("/menu")}
                >
                  Continue Shopping
                </button>
              </div>
            )}
            <table className="table table-hover table-sm align-middle">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${item.image}`}
                          alt={item.item_name}
                          width="55"
                          height="55"
                          className="rounded me-3"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h6 className="mb-0 fw-semibold">{item.item_name}</h6>
                        </div>
                      </div>
                    </td>

                    <td>৳{item.item_price}</td>

                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => decreaseQty(item.id)}
                        >
                          -
                        </button>

                        <button className="btn btn-light">
                          {item.quantity}
                        </button>

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      ৳{(item.quantity * Number(item.item_price)).toFixed(2)}
                    </td>

                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mt-4 shadow border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Subtotal</h5>

              <h4 className="mb-0 text-success fw-bold">
                ৳{subtotal.toFixed(2)}
              </h4>
            </div>

            <hr />

            <button
              className="btn btn-warning btn-lg w-100"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    cartItems: cart,
                  },
                })
              }
            >
              Proceed To Checkout
            </button>
            
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;
