import React, { useEffect, useState } from 'react';
import {
  Users, DollarSign, BarChart2, Target, MessageCircle, Eye, Edit,
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Title, Tooltip, Legend);

const BrandDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("users");
    const parsedUser = rawUser && rawUser !== "undefined" && rawUser !== null ? JSON.parse(rawUser) : null;

    if (!parsedUser?.id) {
      setError("ID utilisateur non trouvé.");
      return;
    }

    const userId = parsedUser.id;

    fetch(`http://localhost:3001/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.role === "business") {
          if (typeof data.profileComplete === "undefined") data.profileComplete = 65;
          setUserData(data);
        } else {
          setError("L'utilisateur n'est pas une marque.");
        }
      })
      .catch(() => setError("Erreur lors du chargement des données utilisateur."));
  }, []);

  if (error) return <p className="error-msg">{error}</p>;
  if (!userData) return <p className="loading-msg">Chargement des données...</p>;

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "",
        data: [50, 80, 30, 60, 100, 40],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ["Catégorie A", "Catégorie B", "Catégorie C", "Catégorie D"],
    datasets: [
      {
        data: [25, 35, 20, 20],
        backgroundColor: ["#F6E6AB", "#36A2EB", "#4F6095", "#4CAF50"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {userData.name}</p>
      </main>

      {/*  Alerte si profil incomplet */}
      {userData.profileComplete < 100 && (
        <div className="brand-alert">
          <div className="brand-alert-header">
            <div className="brand-alert-info">
              <div className="brand-alert-icon">
                <Edit size={24} color="#2563eb" />
              </div>
              <div>
                <h3 className="brand-alert-title">Optimisez votre profil de marque</h3>
                <p className="brand-alert-description">
                  Votre profil est complété à {userData.profileComplete}%.
                  Ajoutez plus d'informations pour attirer les meilleurs influenceurs.
                </p>
              </div>
            </div>
            <Link to="/profile/brand/complete" className="brand-alert-button">
              Compléter
            </Link>
          </div>
          <div className="brand-alert-progress-wrapper">
            <div className="brand-alert-progress-bg">
              <div
                className="brand-alert-progress-bar"
                style={{ width: `${userData.profileComplete}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="user-info">
        <span className={`status-badge ${userData.verified ? "verified" : "not-verified"}`}>
          {userData.verified ? "Vérifié" : "Non vérifié"}
        </span>
        {userData.role && <span className="role-badge">{userData.role}</span>}
      </div>

      <section className="stats-grid">
        <div className="stat-card icon-dollars">
          <div className="icon"><DollarSign /></div>
          <div>
            <p className="label">Budget total dépensé</p>
            <p className="value">{/* à compléter */}</p>
          </div>
        </div>

        <div className="stat-card icon-bar">
          <div className="icon"><BarChart2 /></div>
          <div>
            <p className="label">Campagnes actives</p>
            <p className="value">{/* à compléter */}</p>
          </div>
        </div>

        <div className="stat-card icon-users">
          <div className="icon"><Users /></div>
          <div>
            <p className="label">Influenceurs partenaires</p>
            <p className="value">{userData.collaborations}</p>
          </div>
        </div>

        <div className="stat-card icon-target">
          <div className="icon"><Target /></div>
          <div>
            <p className="label">ROI moyen</p>
            <p className="value">{userData.rating}</p>
          </div>
        </div>
      </section>

      <div className="grid-two-columns">
        <section className="panel-section">
          <h2>Performance des campagnes</h2>
          <Line data={chartData} />
        </section>

        <section className="panel-section">
          <h2>Répartition par catégorie</h2>
          <Pie data={pieChartData} />
        </section>
      </div>

      <div className="panel-row">
        <section className="panel-section half-width">
          <h2>
            Campagnes récentes <a className="link-view-all" href="#">Voir tout</a>
          </h2>
          {/* ... cartes de campagnes ... */}
        </section>

        <section className="panel-section half-width">
          <h2>
            Top influenceurs <a className="link-view-all" href="#">Découvrir plus</a>
          </h2>
          {/* ... top influenceurs ... */}
        </section>
      </div>

      <section className="panel-section">
        <h2>Actions rapides</h2>
        <div className="quick-actions">
          <button className="quick-action"><Users className="icon" /> Trouver des influenceurs</button>
          <button className="quick-action"><BarChart2 className="icon" /> Créer une campagne</button>
          <button className="quick-action"><MessageCircle className="icon" /> Messages</button>
          <button className="quick-action"><Eye className="icon" /> Rapports détaillés</button>
        </div>
      </section>
    </div>
  );
};

export default BrandDashboard;
