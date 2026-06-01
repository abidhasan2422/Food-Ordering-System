import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {CSVLink} from 'react-csv'



const ManageCategory = () => {
    const [showModal, setShowModal] =
  useState(false);

const [editCategoryId,
  setEditCategoryId] =
  useState(null);

const [editCategoryName,
  setEditCategoryName] =
  useState("");

  const openEditModal = (
  id,
  categoryName
) => {

  setEditCategoryId(id);

  setEditCategoryName(
    categoryName
  );

  setShowModal(true);
};

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredCategories =
    categories.filter((category) =>
      category.category_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    const response = await fetch(
      `http://127.0.0.1:8000/api/category/delete/${id}/`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {

      toast.success(data.message);

      fetchCategories();

    } else {

      toast.error("Delete Failed");

    }

  } catch (error) {

    console.log(error);

    toast.error("Server Error");

  }
};


const handleUpdate = async () => {

  try {

    const response =
      await fetch(
        `http://127.0.0.1:8000/api/category/update/${editCategoryId}/`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            category_name:
              editCategoryName,
          }),
        }
      );

    const data =
      await response.json();

    if (response.ok) {

      toast.success(
        data.message
      );

      setShowModal(false);

      fetchCategories();

    } else {

      toast.error(
        "Update Failed"
      );

    }

  } catch (error) {

    toast.error(
      "Server Error"
    );

  }
};


  return (
    <AdminLayout>

      <div className="container-fluid">

        <div className="card shadow-sm">

          <div className="card-body">

            <div className="d-flex justify-content-between mb-4">

              <h3>Manage Categories</h3>

              <span className="badge bg-primary fs-6">
                Total Categories: {categories.length}
              </span>

            </div>
            <div className="mb-3 d-flex justify-content-between">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search Category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
            <CSVLink data={categories}className="btn btn-success"><i className="fas fa-file-csv me-2"></i> Export to CSV</CSVLink>
            </div>
            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>S.N</th>
                  <th>Category Name</th>
                  <th>Creation Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredCategories.map(
                  (category, index) => (

                    <tr key={category.id}>

                      <td>{index + 1}</td>

                      <td>
                        {category.category_name}
                      </td>
                      <td>
                        {/* {new Date(category.creation_date).toDateString("en-GB")} */}
                        {new Date(category.creation_date).toLocaleDateString("en-GB")}
                      </td>

                      <td>

                        <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                                openEditModal(
                                category.id,
                                category.category_name
                                )
                            }
                            >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                                handleDelete(category.id)
                            }
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

{
  showModal && (

    <div
      className="modal d-block"
      tabIndex="-1"
    >

      <div className="modal-dialog">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title">
              Edit Category
            </h5>

            <button
              className="btn-close"
              onClick={() =>
                setShowModal(false)
              }
            ></button>

          </div>

          <div className="modal-body">

            <label
              className="form-label"
            >
              Category Name
            </label>

            <input
              type="text"
              className="form-control"
              value={
                editCategoryName
              }
              onChange={(e) =>
                setEditCategoryName(
                  e.target.value
                )
              }
            />

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={() =>
                setShowModal(false)
              }
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={
                handleUpdate
              }
            >
              Update
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}
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

export default ManageCategory;