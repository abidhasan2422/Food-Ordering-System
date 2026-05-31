import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ProtectedRoute from "./components/ProtectedRoute";
import ManageCategory from "./pages/ManageCategory";
import "./styles/sidebar.css";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}> </Route>
        <Route path='/admin-login' element={<AdminLogin/>}> </Route>
       <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /> </ProtectedRoute>} />
       <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/category/manage" element={<ManageCategory />} />
       {/*<Route path="/admin/food/add" element={<AddFood />} />
        <Route path="/admin/food/manage" element={<FoodList />} />
        <Route path="/admin/restaurant/add" element={<AddRestaurant />} />
        <Route path="/admin/restaurant/list" element={<RestaurantList />} /> 
        <Route path="/admin/restaurant/manage" element={<RestaurantList />} /> */}
    </Routes>
    </BrowserRouter>
  )
}

 
export default App;
//main App
