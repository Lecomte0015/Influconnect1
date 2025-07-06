import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, User, Wallet, CreditCard } from 'lucide-react';
import logo from '../assets/logo1.png';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('users'));
  const userType = user?.role;
  const userName = user?.username || '';

  const handleLogout = () => {
    localStorage.removeItem('users');
    navigate('/');
    window.location.reload();
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin':
        return 'Administrateur';
      case 'brand':
        return 'Marque';
      case 'influencer':
        return 'Influenceur';
      default:
        return '';
    }
  };

  return (
    <header className="header-dash">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Influconnect Logo" className="logo-image" />
          <span className="user-type">{getUserTypeLabel()}</span>
        </div>

        <div className="actions">
          <button className="btn-icon">
            <Bell className="icon" />
            <span className="notification-dot"></span>
          </button>

          {/* Influenceur uniquement */}
          {userType === 'influencer' && (
            <>
              <button className="btn-icon" onClick={() => navigate('/influencer/wallet')}>
                <Wallet className="icon" />
              </button>
              <button className="btn-icon" onClick={() => navigate('/influencer/subscription')}>
                <CreditCard className="icon" />
              </button>
            </>
          )}

          {/* Brand uniquement */}
          {userType === 'brand' && (
            <>
              <button className="btn-icon" onClick={() => navigate('/brand/campaigns')}>
                <CreditCard className="icon" />
              </button>
            </>
          )}

          <button className="btn-icon">
            <Settings className="icon" />
          </button>

          <div className="user-menu">
            <div className="user-avatar">
              <User className="icon-avatar" />
            </div>
            {userName && <span className="user-name">{userName}</span>}
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut className="icon" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
