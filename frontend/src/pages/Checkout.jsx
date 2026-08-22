import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import userApi from "../utils/userApi";
import { toast, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);
  const food = location.state?.food;
  const quantity = location.state?.quantity || 1;

  const cartItems = location.state?.cartItems || [];



  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    area: "",
    notes: "",
  });
  const handleOrder = async () => {
    const orderData = {
      full_name: formData.full_name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      area: formData.area,
      notes: formData.notes,

      subtotal: subtotal,
      delivery_charge: deliveryCharge,
      total_amount: total,
      payment_method: paymentMethod,
    };

    // Buy Now
    if (food) {
      orderData.food_id = food.id;
      orderData.quantity = quantity;
    }

    // form  validation
    if (!formData.full_name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email address is required.");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Delivery address is required.");
      return;
    }

    if (!formData.city) {
      toast.error("Please select your city.");
      return;
    }

    if (!formData.area) {
      toast.error("Please select your delivery area.");
      return;
    }
    try {
      let response;

      if (paymentMethod === "COD") {
        response = await userApi.post(
          food ? "order/create/" : "order/create-from-cart/",
          orderData,
        );

        await fetchCartCount();

        toast.success("Order placed successfully", {
          autoClose: 1500,
          // onClose: () => navigate("/order-success"),
          onClose: () => navigate(`/order-success/${response.data.order_id}`),
        });
      } else if (paymentMethod === "SSLCOMMERZ") {
        response = await userApi.post("payment/initiate/", orderData);
        if (response.data.GatewayPageURL) {
          window.location.href = response.data.GatewayPageURL;
        } else {
          toast.error("Unable to initialize payment.");
        }
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        toast.error("Please check your information and try again.");
      } else if (error.response?.status === 401) {
        toast.info("Please login to place your order.", {
          autoClose: 1500,
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  if (!food && cartItems.length === 0) {
    return (
      <PublicLayout>
        <div className="container py-5 text-center">
          <h3>No food selected.</h3>
        </div>
      </PublicLayout>
    );
  }

  const subtotal = food
    ? Number(food.item_price) * quantity
    : cartItems.reduce(
        (sum, item) => sum + Number(item.item_price) * item.quantity,
        0,
      );

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
                <h3 className="fw-bold mb-4">Delivery Information</h3>

                <label className="form-label fw-semibold">
                  Full Name <span className="text-danger">*</span>
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
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-control mb-3"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  value={formData.phone}
                />

                <label className="form-label fw-semibold">
                  Email Address <span className="text-danger">*</span>
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
                  Delivery Area <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select mb-3"
                  value={formData.area}
                  onChange={handleChange}
                  name="area"
                >
                  <option value="">Select Area</option>
                  <option value="dhaka">Dhaka City</option>
                  <option value="outside">Outside Dhaka</option>
                </select>

                <label className="form-label fw-semibold">
                  Delivery Address <span className="text-danger">*</span>
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
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className="form-control mb-3"
                  placeholder="Enter city"
                  onChange={handleChange}
                  value={formData.city}
                />

                <label className="form-label fw-semibold">Order Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  className="form-control mb-4"
                  placeholder="Any special instructions..."
                  onChange={handleChange}
                  value={formData.notes}
                ></textarea>

                {/* <hr className="my-4" /> */}

                {/* Payment Selection Options */}
                <div className="payment-options">
                  <h5 className="fw-bold mb-3">Select Payment Method</h5>

                  <div className="d-flex flex-column gap-3">
                    {/* Cash On Delivery Card */}
                    <div
                      className={`card p-3 shadow-sm ${paymentMethod === "COD" ? "border-primary   bg-light" : "border-light"}`}
                      onClick={() => setPaymentMethod("COD")}
                      style={{
                        cursor: "pointer",
                        transition: "0.2s ease-in-out",
                      }}
                    >
                      <div className="form-check m-0 d-flex align-items-center gap-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="paymentGroup"
                          id="cod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label
                          className="form-check-label fw-bold mb-0"
                          htmlFor="cod"
                          style={{ cursor: "pointer" }}
                        >
                          Cash On Delivery
                        </label>
                      </div>
                      <small className="text-muted mt-2 ms-4 d-block">
                        Pay with cash when your food arrives.
                      </small>
                    </div>

                    {/* SSLCOMMERZ Card */}
                    <div
                      className={`card p-3 shadow-sm ${paymentMethod === "SSLCOMMERZ" ? "border-primary   bg-light" : "border-light"}`}
                      onClick={() => setPaymentMethod("SSLCOMMERZ")}
                      style={{
                        cursor: "pointer",
                        transition: "0.2s ease-in-out",
                      }}
                    >
                      <div className="form-check m-0 d-flex align-items-center gap-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="paymentGroup"
                          id="ssl"
                          value="SSLCOMMERZ"
                          checked={paymentMethod === "SSLCOMMERZ"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label
                          className="form-check-label fw-bold mb-0"
                          htmlFor="ssl"
                          style={{ cursor: "pointer" }}
                        >
                          Pay Online (SSLCOMMERZ)
                        </label>
                      </div>
                      <small className="text-muted mt-2 ms-4 d-block">
                        Securely pay via bKash, Nagad, Visa, or Mastercard.
                      </small>
                    </div>
                  </div>
                </div>

                {/* Final Primary Action Button */}
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
                <h3 className="fw-bold mb-4">Order Summary</h3>

                {food ? (
                  <>
                    <img
                      src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${food.image}`}
                      alt={food.item_name}
                      className="img-fluid rounded mb-3"
                      style={{
                        height: "220px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="fw-bold">{food.item_name}</h5>

                    <p className="mb-2">
                      <strong>Price:</strong> ৳{food.item_price}
                    </p>

                    <p className="mb-2">
                      <strong>Quantity:</strong> {quantity}
                    </p>
                  </>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${item.image}`}
                          alt={item.item_name}
                          width="60"
                          height="60"
                          className="rounded me-3"
                          style={{
                            objectFit: "cover",
                          }}
                        />

                        <div>
                          <h6 className="mb-1">{item.item_name}</h6>

                          <small className="text-muted">
                            Qty: {item.quantity}
                          </small>
                        </div>
                      </div>

                      <strong>
                        ৳{(Number(item.item_price) * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))
                )}

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
                    Congratulations! Free Delivery Applied
                  </div>
                )}

                <hr />

                <div className="bg-light rounded p-3 text-center">
                  <small className="text-muted">Total Amount</small>

                  <h2 className="text-success fw-bold mb-0">৳{total}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </PublicLayout>
  );
};

export default Checkout;
