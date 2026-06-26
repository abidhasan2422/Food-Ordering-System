import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminApi from "../utils/adminApi";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
    if (!categoryName.trim()) {
  toast.error("Category Name is required");
  return;
}
  try {
    const response = await adminApi.post(
      "add-category/",
      {
  
          category_name: categoryName,
      
      }
    );


     //console.log(response.data);

     toast.success(response.data.message);

     setCategoryName("");

   

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

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <h3 className="mb-4">
              <FaPlusCircle className="text-primary me-2" />
              Add Category
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Category Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                <FaPlusCircle className="me-2" />
                Add Category
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

export default AddCategory;