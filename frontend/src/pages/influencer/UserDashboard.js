import React, { useEffect, useState } from 'react';
import { Star, Calendar, BarChart2, Users, MessageSquare, Award, Edit } from 'lucide-react';
import Notifications from '../common/Notifications';
import { Link } from 'react-router-dom';
import { calculateProfileScore } from '../../utils/profileUtils'; 

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("users"));
    const userId = user?.id;

    if (!userId) {
      setError("ID utilisateur non trouvé dans le localStorage");
      return;
    }

    fetch(`http://localhost:3001/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        const { percentage, isComplete } = calculateProfileScore(data); //  Calcul du score
        setUserData({ ...data, profileCompletion: percentage, is_profile_complete: isComplete }); 
      })
      .catch(() => setError("Erreur lors du chargement des données utilisateur."));

    fetch('/api/events')
      .then(res => res.json())
      .then(setUpcomingEvents)
      .catch(console.error);

    fetch('/api/activities')
      .then(res => res.json())
      .then(setRecentActivities)
      .catch(console.error);

    fetch('/api/notifications')
      .then(res => res.json())
      .then(setNotifications)
      .catch(console.error);
  }, []);

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Chargement...</p>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {userData.lastname}</p>
      </main>

      {!userData.is_profile_complete && (
        <div className="profile-alert">
          <div className="profile-alert-header">
            <div className="profile-alert-info">
              <div className="profile-alert-icon-wrapper">
                <Edit className="profile-alert-icon" />
              </div>
              <div>
                <h3 className="profile-alert-title">Complétez votre profil</h3>
                <p className="profile-alert-text">
                  Il vous manque des informations importantes pour que votre profil soit visible par les marques.
                </p>
              </div>
            </div>
            <Link to="/profile/influencer/complete" className="profile-alert-button">
              Compléter
            </Link>
          </div>

          <div className="profile-alert-progress-bar">
            <div
              className="profile-alert-progress"
              style={{ width: `${userData.profileCompletion}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="user-info">
        <span className={`status-badge ${userData.verified ? 'verified' : 'not-verified'}`}>
          {userData.verified ? 'Vérifié' : 'Non vérifié'}
        </span>
        {userData.role && (
          <span className="role-badge">{userData.role}</span>
        )}
      </div>

      <section className="stats-grid">
        <div className="stat-card-1">
          <div className="container-icon-users">
            <Users className="user-icon" />
          </div>
          <div>
            <p className="stat-label">Abonnés</p>
            <p className="stat-value">{userData.followers}</p>
          </div>
        </div>

        <div className="stat-card-2">
          <div className="container-icon-stat">
            <BarChart2 className="stat-icon" />
          </div>
          <div>
            <p className="stat-label">Vues du profil</p>
            <p className="stat-value">{userData.profileViews}</p>
          </div>
        </div>

        <div className="stat-card-3">
          <div className="container-icon-message">
            <MessageSquare className="message-icon" />
          </div>
          <div>
            <p className="stat-label">Collaborations</p>
            <p className="stat-value">{userData.collaborations}</p>
          </div>
        </div>

        <div className="stat-card-4">
          <div className="container-icon-star">
            <Star className="star-icon" />
          </div>
          <div>
            <p className="stat-label">Note moyenne</p>
            <p className="stat-value">{userData.rating}</p>
          </div>
        </div>
      </section>

      <div className="grid-two-columns">
        <section className="panel-section">
          <h2>Activité récente</h2>
          {recentActivities.length === 0 ? (
            <p>Aucune activité récente.</p>
          ) : (
            recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'collaboration' ? <Users /> :
                    activity.type === 'message' ? <MessageSquare /> :
                      <Award />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-date">{activity.date}</p>
                </div>
                <span className={`activity-status ${activity.status}`}>{activity.status}</span>
              </div>
            ))
          )}
        </section>

        <section className="panel-section">
          <h2>Événements à venir</h2>
          {upcomingEvents.length === 0 ? (
            <p>Aucun événement à venir.</p>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="event-item">
                <Calendar className="event-icon" />
                <div>
                  <p className="event-title">{event.title}</p>
                  <p className="event-date">{event.date} à {event.time}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <section className="notifications-section">
        <Notifications notifications={notifications} />
      </section>
    </div>
  );
};

export default UserDashboard;
