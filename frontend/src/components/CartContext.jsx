import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalQty =
        response.data.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      setCartCount(totalQty);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;