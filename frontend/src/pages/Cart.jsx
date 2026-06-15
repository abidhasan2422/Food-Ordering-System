import React, { useEffect, useState } from "react";
import axios from "axios";
import PublicLayout from "../components/PublicLayout";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("access_token");

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      await axios.patch(
        `http://127.0.0.1:8000/api/cart/increase/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQty = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/cart/decrease/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart/remove/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.item_price) * item.quantity,
    0
  );

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4">
          Shopping Cart
        </h2>

        <div className="card shadow border-0">
          <div className="card-body">
            <table className="table align-middle">
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
                          src={`http://127.0.0.1:8000${item.image}`}
                          alt={item.item_name}
                          width="70"
                          className="rounded me-3"
                        />
                        {item.item_name}
                      </div>
                    </td>

                    <td>
                      ৳{item.item_price}
                    </td>

                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                        >
                          -
                        </button>

                        <button className="btn btn-light">
                          {item.quantity}
                        </button>

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            increaseQty(item.id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      ৳
                      {(
                        item.quantity *
                        Number(item.item_price)
                      ).toFixed(2)}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
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
            <h4>
              Subtotal:
              <span className="float-end">
                ৳{subtotal.toFixed(2)}
              </span>
            </h4>

            <hr />

            <button className="btn btn-warning btn-lg w-100">
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;