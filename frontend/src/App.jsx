import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategory from "./pages/AddCategory";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
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
import ManageOrders from "./pages/ManageOrders";
import ManageOrderDetails from "./pages/ManageOrderDetails"
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import SalesReport from "./pages/SalesReport";
import OrderReport from "./pages/OrderReport";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Menu from "./pages/Menu";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"
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
          <Route path="/admin-dashboard" element={ <AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>} />
          <Route path="/admin/category/add" element={<AdminProtectedRoute> <AddCategory /> </AdminProtectedRoute>} />
          <Route path="/admin/category/manage" element={<AdminProtectedRoute> <ManageCategory /> </AdminProtectedRoute>} />
          <Route path="/admin/food/add" element={<AdminProtectedRoute> <AddFood /> </AdminProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/admin/food/manage" element={<AdminProtectedRoute> <ManageFood /> </AdminProtectedRoute>} />
          <Route path="/cart" element={  <UserProtectedRoute>  <Cart /> </UserProtectedRoute>  } />
          <Route path="/checkout" element={<UserProtectedRoute> <Checkout /> </UserProtectedRoute>} />
          <Route path="/order-success" element={<UserProtectedRoute> <OrderSuccess /> </UserProtectedRoute>} />
          <Route path="/my-orders" element={<UserProtectedRoute> <MyOrders /></UserProtectedRoute>} />
          <Route path="/order/:id" element={<UserProtectedRoute> <OrderDetails /> </UserProtectedRoute>} />
          <Route path="/admin/orders" element={<AdminProtectedRoute> <ManageOrders /> </AdminProtectedRoute>} />
          <Route path="/admin/order/:id" element={<AdminProtectedRoute> <ManageOrderDetails /> </AdminProtectedRoute>} />
          <Route path="/admin/customers" element={<AdminProtectedRoute> <Customers /> </AdminProtectedRoute>} />
          <Route path="/admin/customers/:id" element={<AdminProtectedRoute> <CustomerDetails /> </AdminProtectedRoute>} />
          <Route path="/admin/sales-report" element={<AdminProtectedRoute> <SalesReport /> </AdminProtectedRoute>} />
          <Route path="/admin/order-report" element={<AdminProtectedRoute> <OrderReport /> </AdminProtectedRoute>} />
          <Route path="/profile" element={  <UserProtectedRoute>  <Profile /> </UserProtectedRoute>  } />
          <Route path="/edit-profile" element={  <UserProtectedRoute>  <EditProfile /> </UserProtectedRoute>  } />
          <Route path="/change_password" element={  <UserProtectedRoute>  <ChangePassword /> </UserProtectedRoute>  } />
          <Route path="/menu" element={<Menu />} />
          <Route path="/wishlist" element={  <UserProtectedRoute>  <Wishlist /> </UserProtectedRoute>  } />
          <Route path="/forgot-password" element={  <ForgotPassword />   } />
           <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

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
