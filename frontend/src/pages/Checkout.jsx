import React from "react";
import { useLocation } from "react-router-dom";

const Checkout = () => {

  const location = useLocation();

  const food = location.state?.food;

  const quantity =
    location.state?.quantity;

  return (
    <div>
      <h2>Checkout Page</h2>

      <h4>{food?.item_name}</h4>

      <p>Quantity: {quantity}</p>
    </div>
  );
};

export default Checkout;