import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, User, Wallet, CreditCard } from 'lucide-react';
import logo from '../../assets/logo1.png';

const InfluencerHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('users'));
  const userName = user?.username;

  const handleLogout = () => {
    localStorage.removeItem('users');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header-dash">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>Influenceur</span>
        </div>

        <div className="actions">
          <button className="btn-icon"><Bell /></button>
          <button className="btn-icon" onClick={() => navigate('/influencer/wallet')}>
            <Wallet />
          </button>
          <button className="btn-icon" onClick={() => navigate('/influencer/subscription')}>
            <CreditCard />
          </button>
          <button className="btn-icon"><Settings /></button>

          <div className="user-menu">
            <User className="icon-avatar" />
            <span className="user-name">{userName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default InfluencerHeader;
