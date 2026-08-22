import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import adminApi from "../utils/adminApi";
import userApi from "../utils/userApi";

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editFood, setEditFood] = useState({
    id: "",
    item_name: "",
    item_price: "",
    item_quantity: "",
    item_description: "",
    is_available: true,
  });

  const openEditModal = (food) => {
    setEditFood({
      id: food.id,
      item_name: food.item_name,
      item_price: food.item_price,
      item_quantity: food.item_quantity,
      item_description: food.item_description,
      is_available: food.is_available,
    });

    setShowModal(true);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFoods(currentPage);
  }, [currentPage]);

  const fetchFoods = async (page = 1) => {
    try {
      const response = await userApi.get(`foods/?page=${page}`);

      const data = response.data;

      setFoods(Array.isArray(data.results) ? data.results : []);

      setTotalPages(Math.ceil((data.count || 0) / 5));
    } catch (error) {
      console.log(error);
      setFoods([]);
    }
  };

  const filteredFoods = (foods || []).filter((food) =>
    food.item_name?.toLowerCase().includes(search.toLowerCase()),
  );
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this food item?");

    if (!confirmDelete) return;

    try {
      await adminApi.delete(`food/delete/${id}/`);

      toast.success("Food deleted successfully");

      await fetchFoods(currentPage);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };
  const handleUpdateFood = async () => {
    try {
      await adminApi.put(`food/update/${editFood.id}/`, {
        item_name: editFood.item_name,
        item_price: editFood.item_price,
        item_quantity: editFood.item_quantity,
        item_description: editFood.item_description,
        is_available: editFood.is_available,
      });

      toast.success("Food updated successfully");

      setShowModal(false);

      await fetchFoods(currentPage);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Update Failed");
    }
  };
  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-4">
              <h3>Manage Food Items</h3>

              <CSVLink
                data={foods}
                filename={"foods.csv"}
                className="btn btn-success"
              >
                Export CSV
              </CSVLink>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <h5>
                Total Foods:
                <span className="badge bg-primary ms-2">{foods.length}</span>
              </h5>

              <input
                type="text"
                className="form-control w-25"
                placeholder="Search Food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.N</th>

                  <th>Image</th>

                  <th>Food Name</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Quantity</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredFoods.map((food, index) => (
                  <tr key={food.id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${food.image}`}
                        alt=""
                        width="60"
                        height="60"
                        className="rounded"
                      />
                    </td>

                    <td>{food.item_name}</td>

                    <td>{food.category_name}</td>

                    <td>৳{food.item_price}</td>

                    <td>{food.item_quantity}</td>

                    <td>
                      {food.is_available ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => openEditModal(food)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(food.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showModal && (
              <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Food Item</h5>

                      <button
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3">
                        <label>Food Name</label>

                        <input
                          type="text"
                          className="form-control"
                          value={editFood.item_name}
                          onChange={(e) =>
                            setEditFood({
                              ...editFood,
                              item_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label>Price</label>

                        <input
                          type="number"
                          className="form-control"
                          value={editFood.item_price}
                          onChange={(e) =>
                            setEditFood({
                              ...editFood,
                              item_price: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label>Quantity</label>

                        <input
                          type="text"
                          className="form-control"
                          value={editFood.item_quantity}
                          onChange={(e) =>
                            setEditFood({
                              ...editFood,
                              item_quantity: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label>Description</label>

                        <textarea
                          rows="3"
                          className="form-control"
                          value={editFood.item_description}
                          onChange={(e) =>
                            setEditFood({
                              ...editFood,
                              item_description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label>Availability</label>

                        <select
                          className="form-select"
                          value={editFood.is_available}
                          onChange={(e) =>
                            setEditFood({
                              ...editFood,
                              is_available: e.target.value === "true",
                            })
                          }
                        >
                          <option value={true}>Available</option>

                          <option value={false}>Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={handleUpdateFood}
                      >
                        Update Food
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn me-2 ${
                    currentPage === index + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </AdminLayout>
  );
};

export default ManageFood;
