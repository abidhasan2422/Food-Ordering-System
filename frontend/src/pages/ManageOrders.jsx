import React,{useEffect,useState} from 'react'
import axios from "axios";
const ManageOrders = () => {
 const [orders, setOrders] = useState([]);
useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async (
  status = ""
) => {

  const token =
    localStorage.getItem("admin_access");

  let url =
    "http://127.0.0.1:8000/api/admin/orders/";

  if (status) {
    url += `?status=${status}`;
  }

  const response =
    await axios.get(
      url,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setOrders(response.data);
};
const updateStatus = async (
  id,
  status
) => {

  const token =
    localStorage.getItem("admin_access");

  await axios.patch(
    `http://127.0.0.1:8000/api/admin/orders/${id}/status/`,
    {
      status
    },
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  fetchOrders();
};
  return (
    <>
    
    <div className="mb-4">

  <button
    className="btn btn-dark me-2"
    onClick={() =>
      fetchOrders()
    }
  >
    All Orders
  </button>

  <button
    className="btn btn-warning me-2"
    onClick={() =>
      fetchOrders("Pending")
    }
  >
    Pending
  </button>

  <button
    className="btn btn-primary me-2"
    onClick={() =>
      fetchOrders("Confirmed")
    }
  >
    Confirmed
  </button>

  <button
    className="btn btn-info me-2"
    onClick={() =>
      fetchOrders("Processing")
    }
  >
    Processing
  </button>

  <button
    className="btn btn-success me-2"
    onClick={() =>
      fetchOrders("Delivered")
    }
  >
    Delivered
  </button>

  <button
    className="btn btn-danger"
    onClick={() =>
      fetchOrders("Cancelled")
    }
  >
    Cancelled
  </button>

</div>
<table className="table table-hover">
    

<thead>

<tr>
  <th>Order ID</th>
  <th>Customer</th>
  <th>Phone</th>
  <th>Total</th>
  <th>Status</th>
  <th>Action</th>
</tr>

</thead>

<tbody>

{orders.map((order) => (

<tr key={order.id}>

  <td>{order.order_number}</td>

  <td>{order.full_name}</td>

  <td>{order.phone}</td>

  <td>৳{order.total_amount}</td>

  <td>

    <span
      className={
        order.status === "Pending"
          ? "badge bg-warning"
          : order.status === "Confirmed"
          ? "badge bg-primary"
          : "badge bg-success"
      }
    >
      {order.status}
    </span>

  </td>

  <td>

    <select
      className="form-select"
      value={order.status}
      onChange={(e) =>
        updateStatus(
          order.id,
          e.target.value
        )
      }
    >

      <option value="Pending">
        Pending
      </option>

      <option value="Confirmed">
        Confirmed
      </option>

      <option value="Delivered">
        Delivered
      </option>
      <option value="Cancelled">
        Cancelled
      </option>

    </select>

  </td>

</tr>

))}

</tbody>

</table>
</>
  )
}

export default ManageOrders;