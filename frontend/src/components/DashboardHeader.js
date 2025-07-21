import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Bell, Settings, Heart, User, Wallet, CreditCard,
  ChevronDown, X
} from 'lucide-react';
import logo from '../assets/logo1.png';

const DashboardHeader = ({ notifications = [], onSaveSettings }) => {
  const navigate = useNavigate();



  const user = JSON.parse(localStorage.getItem('users'));
  const userType = user?.role;


  const userName = user?.username || '';

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [settings, setSettings] = useState({
    username: userName,
    email: user?.email || '',
    notifyCollab: true,
    notifyMessages: true,
    notifyPayments: true,
    publicProfile: true,
    showStats: true,
    password: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null,
    avatarPreview: user?.avatarUrl || null
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Administrateur';
      case 'brand': return 'Marque';
      case 'influencer': return 'Influenceur';
      default: return '';
    }
  };

  const getBasePath = () => {
    return userType === 'admin' ? '/admin' :
           userType === 'brand' ? '/brand' : '/influencer';
  };

  const handleLogout = () => {
    localStorage.removeItem('users');
    navigate('/');
    window.location.reload();
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (onSaveSettings) onSaveSettings(settings);
    setShowSettings(false);
  };

  return (
    <header className="header-dash">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="user-type">{getUserTypeLabel()}</span>
        </div>

        <div className="actions">
          
          {userType === 'brand' && (
            <Link
              to="/my-favorites"
              className="btn-icon"
              title="Mes favoris"
              onClick={() => {
                setShowDropdown(false);
                setShowSettings(false);
                setShowNotifications(false);
              }}
            >
              <Heart className="icon" />
            </Link>
          )}

          {/* Notifications */}
          <div className="notif-container">
            <button onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
              setShowDropdown(false);
            }} className="btn-icon">
              <Bell className="icon" />
              {unreadCount > 0 && (
                <span className="notification-dot">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                <div className="notifications-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                      <p className="notification-title">{n.title}</p>
                      <p className="notification-message">{n.message}</p>
                      <span className="notification-time">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button>Voir toutes les notifications</button>
                </div>
              </div>
            )}
          </div>

          
          {userType === 'influencer' && (
            <button className="btn-icon" onClick={() => navigate(`${getBasePath()}/wallet`)}>
              <Wallet className="icon" />
            </button>
          )}

          
          {(userType === 'influencer' || userType === 'brand') && (
            <button className="btn-icon" onClick={() => navigate(`${getBasePath()}/subscription`)}>
              <CreditCard className="icon" />
            </button>
          )}

          
          <button className="btn-icon" onClick={() => {
            setShowSettings(true);
            setShowNotifications(false);
            setShowDropdown(false);
          }}>
            <Settings className="icon" />
          </button>

          
          <div className="user-menu">
            <div className="user-avatar">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="icon-avatar"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <User className="icon-avatar" />
              )}
            </div>

            <span className="user-name">{userName}</span>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut className="icon" />
              <span>Déconnexion</span>
            </button>

            <button className="btn-icon" onClick={() => setShowDropdown(!showDropdown)}>
              <ChevronDown size={18} />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => {
                  navigate(`${getBasePath()}/subscription`);
                  setShowDropdown(false);
                }}>Mon abonnement</button>

                {userType === 'influencer' && (
                  <button onClick={() => {
                    navigate(`${getBasePath()}/wallet`);
                    setShowDropdown(false);
                  }}>Mon portefeuille</button>
                )}

                <hr />

                <button onClick={handleLogout} className="logout-option">
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALE PARAMÈTRES */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Paramètres du compte</h3>
              <button onClick={() => setShowSettings(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>

            <form className="settings-form1">
              <section className="section-grid">
                <h4>Informations du profil</h4>
                <div className="profile-photo-section">
                  <div className="profile-photo-preview">
                    {settings.avatarPreview ? (
                      <img src={settings.avatarPreview} alt="Avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={36} color="#fff" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="avatar-upload" className="upload-btn">Changer la photo</label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSettings(prev => ({
                              ...prev,
                              avatar: file,
                              avatarPreview: reader.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </section>

              <section className="section-grid">
                <h4>Sécurité</h4>

                <div className="field-group">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    value={settings.password}
                    onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                  />
                </div>

                <div className="field-group full-width">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                  />
                </div>
              </section>

              <section className="section-grid">
                <h4>Notifications</h4>

                <div className="setting-toggle">
                  <div className="setting-label">
                    <span>Demandes de collaboration</span>
                    <p>Recevoir des notifications pour les nouvelles demandes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyCollab}
                    onChange={() => handleToggle('notifyCollab')}
                  />
                </div>

                <div className="setting-toggle">
                  <div className="setting-label">
                    <span>Messages</span>
                    <p>Recevoir des notifications pour les nouveaux messages</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyMessages}
                    onChange={() => handleToggle('notifyMessages')}
                  />
                </div>

                <div className="setting-toggle full-width">
                  <div className="setting-label">
                    <span>Paiements</span>
                    <p>Recevoir des notifications pour les paiements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyPayments}
                    onChange={() => handleToggle('notifyPayments')}
                  />
                </div>
              </section>

              <section className="section-grid">
                <h4>Confidentialité</h4>

                <div className="setting-toggle">
                  <div className="setting-label">
                    <span>Profil public</span>
                    <p>Permettre aux autres de voir votre profil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.publicProfile}
                    onChange={() => handleToggle('publicProfile')}
                  />
                </div>

                <div className="setting-toggle">
                  <div className="setting-label">
                    <span>Afficher mes statistiques</span>
                    <p>Permettre aux marques de voir vos statistiques</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showStats}
                    onChange={() => handleToggle('showStats')}
                  />
                </div>
              </section>
            </form>

            <div className="modal-actions">
              <button onClick={() => setShowSettings(false)} className="cancel">Annuler</button>
              <button onClick={handleSave} className="submit">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
