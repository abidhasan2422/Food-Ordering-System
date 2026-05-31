import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminHeader />

      <div className="d-flex">
        <AdminSidebar />

        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f8f9fa",
            minHeight: "100vh",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;