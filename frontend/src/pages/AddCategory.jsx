import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
    console.log("Button Clicked");
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/add-category/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          category_name: categoryName,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log("Success Block Running");

      toast.success(data.message);

      setCategoryName("");

    } else {

      toast.error("Failed to Add Category");

    }

  } catch (error) {

    console.log(error);

    toast.error("Server Error");

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