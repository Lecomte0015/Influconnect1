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
import CollaborationRequests from './components/CollaborationRequests';
import MyFavorites from './pages/common/MyFavorites'
import SubscriptionResponse from "./pages/stripe/SubscriptionResponse";
import Inbox from "./pages/common/Inbox";
import Conversation from "./pages/common/Conversation";



import InfluencerListCard from "./components/BrandListCard";
import ProfileDetail from "./pages/influencer/ProfileDetail";
import UserDashboard from "./pages/influencer/UserDashboard";
import InfluencersListing from "./pages/(public)/InfluencersListing";
import InfluencerProfileCompletion from "./pages/profile/InfluencerProfileCompletion";
import Wallet from "./pages/influencer/UserWallet";
import Subscription from './pages/common/Subscription';







import DetailProfileBrand from "./pages/brand/DetailProfileBrand";
import DashboardHeader from "./components/DashboardHeader";
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandListCard from "./components/BrandListCard";
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
          <Route path="/brands" element={<BrandListCard />} />
          <Route path="/influencers" element={<InfluencerListCard />} />
          

         

        </Route>

        {/*Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="transaction" element={<AdminTransaction />} />
        </Route>


        <Route element={<BrandLayout/>}>
                        
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
          <Route path="/profile/brand/complete" element={<BrandProfileCompletion />} />
          <Route path="/brand/collaborations" element={<CollaborationRequests />} />
          <Route path="/my-favorites" element={<MyFavorites />} />
          <Route path="/brand/subscription" element={<Subscription userType="marque" />} />
          <Route path="/subscription" element={<SubscriptionResponse />} />
          <Route path="/conversation/:userId" element={<Conversation />} />
          <Route path="/inbox" element={<Inbox />} />

        </Route> 

        <Route element={<InfluencerLayout/>}>
         
          <Route path="/influencer/dashboard" element={<UserDashboard />} />
          <Route path="/profile/influencer/complete" element={<InfluencerProfileCompletion />} />
          <Route path="/influencer/wallet" element={<Wallet />} />
          <Route path="/influencer/collaborations" element={<CollaborationRequests />} />
          <Route path="/my-favorites" element={<MyFavorites />} />
          <Route path="/influencer/subscription" element={<Subscription userType="influenceur" />} />
          <Route path="/subscription" element={<SubscriptionResponse />} />
          <Route path="/conversation/:userId" element={<Conversation />} />
          <Route path="/inbox" element={<Inbox />} />


        </Route>


      </Routes>
    
  );
}





export default App;