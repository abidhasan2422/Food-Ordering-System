import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategory from "./pages/AddCategory";
// import ProtectedRoute from "./components/ProtectedRoute";
import ManageCategory from "./pages/ManageCategory";
import "./styles/sidebar.css";
import AddFood from "./pages/AddFood";
import ManageFood from "./pages/ManageFood";
import SearchPage from "./pages/SearchPage";
import Register from "./components/Register";
import Login from "./components/Login";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import CartProvider from "./components/CartContext";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {" "}
          </Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin-login" element={<AdminLogin />}>
            {" "}
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/category/add" element={<AddCategory />} />
          <Route path="/admin/category/manage" element={<ManageCategory />} />
          <Route path="/admin/food/add" element={<AddFood />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/admin/food/manage" element={<ManageFood />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          {/*<Route path="/admin/restaurant/add" element={<AddRestaurant />} />
        <Route path="/admin/restaurant/list" element={<RestaurantList />} /> 
        <Route path="/admin/restaurant/manage" element={<RestaurantList />} /> */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
//main App
