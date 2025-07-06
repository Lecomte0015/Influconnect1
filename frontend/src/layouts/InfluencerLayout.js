import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const InfluencerLayout = () => {
  return (
    <div className="layout-container">
      <DashboardHeader userType="influencer" />
      <div className="div-content">
        <Outlet />
      </div>
    </div>
  );
};

export default InfluencerLayout;
