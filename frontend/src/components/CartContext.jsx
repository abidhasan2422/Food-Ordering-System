import { createContext, useState, useEffect } from "react";
import userApi from "../utils/userApi";

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

      const response = await userApi.get(
        "cart/");
      console.log("Cart API:", response.data);
      const totalQty =
        response.data.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );
      console.log("Cart Count:", totalQty);
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