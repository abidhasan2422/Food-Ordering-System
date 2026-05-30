import AdminSidebar from "../components/AdminSidebar";
const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>Welcome to Food Ordering Admin Panel</p>
      </div>
    </div>
  );
};

export default AdminDashboard;