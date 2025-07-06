
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const BrandLayout = () => {
  return (
    <div className="layout-container">
      <DashboardHeader userType="brand" />
      <div className="div-content">
        <Outlet />
      </div>
    </div>
  );
};

export default BrandLayout;
