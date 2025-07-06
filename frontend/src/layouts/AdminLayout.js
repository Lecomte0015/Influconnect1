import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const AdminLayout = () => {
  return (
    <div className="layout-container">
      <DashboardHeader userType="Admin" userName="Admin" />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
