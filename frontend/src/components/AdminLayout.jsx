
import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AdminHeader setSidebarOpen={setSidebarOpen} />

      <div className="d-flex">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;