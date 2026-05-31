import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

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

    if (response.ok) {

      toast.success(data.message);

      setCategoryName("");

    } else {

      toast.error("Failed to Add Category");

    }

  } catch (error) {

    console.log(error);

    alert("Server Error");

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

      </div>
    </AdminLayout>
  );
};

export default AddCategory;