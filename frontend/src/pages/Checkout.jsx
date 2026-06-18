import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const food = location.state?.food;
  const quantity = location.state?.quantity || 1;

//   const [area, setArea] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    area:"",
    notes: "",
  });
  const handleOrder = async () => {

  const token =
    localStorage.getItem("access_token");

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/api/order/create/",
      {
        food_id: food.id,
        quantity: quantity,

        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        notes: formData.notes,

        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        total_amount: total
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(response.data);

    alert("Order placed successfully");
    navigate("/order-success");
     setFormData({
      full_name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      area: "",
      notes: "",
    });

  } catch (error) {

    console.log(error);

  }
};

  if (!food) {
    return (
      <PublicLayout>
        <div className="container py-5 text-center">
          <h3>No food selected.</h3>
        </div>
      </PublicLayout>
    );
  }

  const subtotal = Number(food.item_price) * quantity;

  const deliveryCharge =
    subtotal >= 1000
      ? 0
      : formData.area === "dhaka"
      ? 60
      : formData.area === "outside"
      ? 120
      : 0;

  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PublicLayout>
      <div className="container py-5">

        <div className="row g-4">

          {/* Delivery Information */}
          <div className="col-lg-7">

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  Delivery Information
                </h3>

                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  className="form-control mb-3"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  value={formData.full_name}
                />

                <label className="form-label fw-semibold">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control mb-3"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                    value={formData.phone}
                />

                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control mb-3"
                  placeholder="Enter email address"
                  onChange={handleChange}
                    value={formData.email}
                />

                <label className="form-label fw-semibold">
                  Delivery Area
                </label>

                <select
                  className="form-select mb-3"
             
                    value={formData.area}
                  onChange={handleChange}
                  name="area"
                >
                  <option value="">
                    Select Area
                  </option>

                  <option value="dhaka">
                    Dhaka City
                  </option>

                  <option value="outside">
                    Outside Dhaka
                  </option>
                </select>

                <label className="form-label fw-semibold">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  rows="3"
                  className="form-control mb-3"
                  placeholder="Enter delivery address"
                  onChange={handleChange}
                    value={formData.address}
                ></textarea>

                <label className="form-label fw-semibold">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  className="form-control mb-3"
                  placeholder="Enter city"
                  onChange={handleChange}
                  value={formData.address}
                />

                <label className="form-label fw-semibold">
                  Order Notes
                </label>

                <textarea
                  name="notes"
                  rows="3"
                  className="form-control"
                  placeholder="Any special instructions..."
                  onChange={handleChange}
                  value={formData.notes}
                ></textarea>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">
                  Payment Method
                </h5>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked
                    readOnly
                  />

                  <label className="form-check-label">
                    Cash On Delivery
                  </label>
                </div>

                <button
                  className="btn btn-success btn-lg w-100 mt-4"
                  onClick={handleOrder}
                >
                  <i className="fas fa-check-circle me-2"></i>
                  Confirm Order
                </button>

              </div>
            </div>

          </div>

          {/* Order Summary */}
          <div className="col-lg-5">

            <div className="card border-0 shadow sticky-top">
              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  Order Summary
                </h3>

                <img
                  src={`http://127.0.0.1:8000${food.image}`}
                  alt={food.item_name}
                  className="img-fluid rounded mb-3"
                  style={{
                    height: "220px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />

                <h5 className="fw-bold">
                  {food.item_name}
                </h5>

                <p className="mb-2">
                  <strong>Price:</strong>
                  {" "}৳{food.item_price}
                </p>

                <p className="mb-2">
                  <strong>Quantity:</strong>
                  {" "}{quantity}
                </p>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Charge</span>

                  <span className="badge bg-warning text-dark">
                    ৳{deliveryCharge}
                  </span>
                </div>

                {subtotal >= 1000 && (
                  <div className="alert alert-success mt-3 mb-3">
                    🎉 Congratulations! Free Delivery Applied
                  </div>
                )}

                <hr />

                <div className="bg-light rounded p-3 text-center">

                  <small className="text-muted">
                    Total Amount
                  </small>

                  <h2 className="text-success fw-bold mb-0">
                    ৳{total}
                  </h2>

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </PublicLayout>
  );
};

export default Checkout;