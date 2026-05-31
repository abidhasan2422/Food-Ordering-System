import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>

      <h2>Dashboard</h2>

      <div className="row mt-4">

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h3>150</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Total Foods</h5>
              <h3>45</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Customers</h5>
              <h3>300</h3>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;