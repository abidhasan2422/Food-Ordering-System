import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";
import adminApi from "../utils/adminApi";


const AddFood = () => {
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  const [foodData, setFoodData] = useState({
    category: "",
    item_name: "",
    item_price: "",
    item_description: "",
    item_quantity: "",
    image: null,
    is_available: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/categories/"
      );

      const data = await response.json();

      setCategories(data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFoodData({
      ...foodData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {

    setFoodData({
      ...foodData,
      image: e.target.files[0],
    });
  };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("category", foodData.category);
    formData.append("item_name", foodData.item_name);
    formData.append("item_price", foodData.item_price);
    formData.append("item_description", foodData.item_description);
    formData.append("item_quantity", foodData.item_quantity);
    formData.append("is_available", foodData.is_available);
    formData.append("image", foodData.image);

    const response = await adminApi.post(
      "add-food/",
      formData
    );

    toast.success(response.data.message);

    setFoodData({
      category: "",
      item_name: "",
      item_price: "",
      item_description: "",
      item_quantity: "",
      image: null,
      is_available: true,
    });

    fileInputRef.current.value = "";

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Server Error"
    );
  }
};

  return (
    <AdminLayout>

      <div className="container-fluid">

        <div className="card shadow">

          <div className="card-body">

            <h3 className="mb-4">
              <FaPlusCircle className="me-2 text-primary" />
              Add Food Item
            </h3>

            <form onSubmit={handleSubmit}>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label">
                  Category
                </label>

                <select
                  className="form-select"
                  name="category"
                  value={foodData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Name */}
              <div className="mb-3">
                <label className="form-label">
                  Food Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="item_name"
                  value={foodData.item_name}
                  onChange={handleChange}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="item_price"
                  value={foodData.item_price}
                  onChange={handleChange}
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <label className="form-label">
                  Quantity
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="item_quantity"
                  value={foodData.item_quantity}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  name="item_description"
                  value={foodData.item_description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Image */}
              <div className="mb-3">
                <label className="form-label">
                  Food Image
                </label>

                <input
                  type="file"
                  className="form-control"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>

              {/* Availability */}
              <div className="mb-4">

                <label className="form-label">
                  Availability
                </label>

                <select
                  className="form-select"
                  name="is_available"
                  value={foodData.is_available}
                  onChange={handleChange}
                >
                  <option value={true}>
                    Available
                  </option>

                  <option value={false}>
                    Not Available
                  </option>
                </select>

              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                <FaPlusCircle className="me-2" />
                Add Food
              </button>

            </form>

          </div>

        </div>
         <ToastContainer
        position="top-right"
        autoClose={2000}
      />
      </div>

    </AdminLayout>
  );
};

export default AddFood;