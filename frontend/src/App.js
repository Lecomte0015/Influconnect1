import React from "react";
import {  Routes, Route } from 'react-router-dom';
import PublicLayout from "./layouts/PublicLayout";
import { Outlet } from "react-router-dom";
import "./App.css";



import  Home  from './pages/Home';
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from './pages/auth/ForgotPassword';
import PasswordReset from './pages/auth/PasswordReset';
import EmailConfirmed from "./pages/confirm/EmailConfirmed";
import EmailRedirect from "./pages/confirm/EmailRedirect";
import EmailInvalid from './pages/confirm/EmailInvalid';
import EmailError from './pages/confirm/EmailError';
import EmailAlreadyConfirmed from './pages/confirm/EmailAlreadyConfirmed';



import InfluencerList from "./components/InfluencerList";
import ProfileDetail from "./pages/influencer/ProfileDetail";
import UserDashboard from "./pages/influencer/UserDashboard";
import InfluencersListing from "./pages/(public)/InfluencersListing";
import InfluencerProfileCompletion from "./pages/profile/InfluencerProfileCompletion";
import Wallet from "./pages/influencer/UserWallet";
import Subscription from "./pages/influencer/Subscription";



import DetailProfileBrand from "./pages/brand/DetailProfileBrand";
import DashboardHeader from "./components/DashboardHeader";
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandList from "./components/BrandList";
import BrandListing from "./pages/(public)/BrandListing";
import BrandProfileCompletion from "./pages/profile/BrandProfileCompletion";





import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminTransaction from "./pages/admin/AdminTransaction";



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



function App() {

  return (
    
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={< Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<PasswordReset />} />
          <Route path="/brandlisting" element={<BrandListing />} /> 
          <Route path="/influencerslisting" element={<InfluencersListing />} /> 
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/confirm/:token" element={<EmailRedirect />} />
          <Route path="/email-invalid" element={<EmailInvalid />} />
          <Route path="/email-error" element={<EmailError />} />
          <Route path="/email-already-confirmed" element={<EmailAlreadyConfirmed />} />
          <Route path="/influencer/:id" element={<ProfileDetail />} />
          <Route path="/brand/:id" element={<DetailProfileBrand />} /> 

        </Route>

        {/*Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="transaction" element={<AdminTransaction />} />
        </Route>


        <Route element={<BrandLayout/>}>
          <Route path="/brands" element={<BrandList />} />              
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
          <Route path="/profile/brand/complete" element={<BrandProfileCompletion />} />

        </Route> 

        <Route element={<InfluencerLayout/>}>
          <Route path="/influencers" element={<InfluencerList />} />
          <Route path="/influencer/dashboard" element={<UserDashboard />} />
          <Route path="/profile/influencer/complete" element={<InfluencerProfileCompletion />} />
          <Route path="/influencer/wallet" element={<Wallet />} />
          <Route path="/influencer/subscription" element={<Subscription />} />
        </Route>


      </Routes>
    
  );
}





export default App;