import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
        <button className="mark-read-btn">Tout marquer comme lu</button>
      </div>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="notification-icon-wrapper">
              <Bell className="notification-icon" />
            </div>
            <div className="notification-content">
              <p className="notification-title">{notification.title}</p>
              <p className="notification-description">{notification.message}</p>
              <p className="notification-time">{notification.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
