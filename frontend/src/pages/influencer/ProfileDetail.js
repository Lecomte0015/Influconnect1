import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award, Users, Instagram, Globe, Star, Calendar, MapPin, MessageSquare
} from 'lucide-react';
import axios from 'axios';

const getPlatformIcon = (name) => {
  switch (name.toLowerCase()) {
    case 'instagram': return Instagram;
    case 'tiktok': return MessageSquare;
    case 'youtube': return Globe;
    default: return Globe;
  }
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ProfileDetail = () => {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchInfluencer = async () => {
   

      try {
        const response = await axios.get(`/api/influencer/${id}`);
        console.log("Données reçues :", response.data);

        setInfluencer(response.data);
        console.log("PHOTO:", response.data.photo);
console.log("COVER:", response.data.cover_image);

      } catch (error) {
        console.error("Erreur lors du chargement de la fiche influenceur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencer();
    

    const stored = JSON.parse(localStorage.getItem('guestFavorites')) || [];
    setIsFavorite(stored.includes(parseInt(id)));
  }, [id]);

  const handleContactClick = () => {
    if (!isLoggedIn) {
      alert("Veuillez vous connecter pour contacter un influenceur.");
      return;
    }
    console.log("Ouverture du formulaire de contact");
  };

  const toggleFavorite = () => {
    const stored = JSON.parse(localStorage.getItem('guestFavorites')) || [];
    const currentId = parseInt(id);
    const updated = stored.includes(currentId)
      ? stored.filter(favId => favId !== currentId)
      : [...stored, currentId];
    localStorage.setItem('guestFavorites', JSON.stringify(updated));
    setIsFavorite(updated.includes(currentId));
  };

  if (loading) return <p className="loading">Chargement du profil...</p>;
  if (!influencer) return <p className="not-found">Influenceur introuvable.</p>;

  return (
    <div className="profile-page">
      <Link to="/InfluencersListing" className="back-link">← Retour aux influenceurs</Link>

      <div className="profile-banner">
      <img src={influencer.cover_image || '/uploads/covers/'} alt="Couverture" className="cover-img" />
        <div className="banner-overlay">
        <img src={influencer.photo || '/uploads/avatar/'} alt={influencer.name} className="avatar" />
          <div>
            <h1>{influencer.name}</h1>
            <p>{influencer.location} • {influencer.age} ans</p>
            <div className="badge-line">
              {influencer.category && <span className="category-badge">{influencer.category}</span>}
              {influencer.verified && <span className="verified"><Award size={14} /> Vérifié</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="main">
          <section className="card">
            <h2>À propos</h2>
            <p>{influencer.description}</p>
            {influencer.bio && (
              <>
                <h3>Bio</h3>
                <p>{influencer.bio}</p>
              </>
            )}
            {influencer.interests?.length > 0 && (
              <>
                <h3>Centres d’intérêt</h3>
                <div className="tags">
                  {influencer.interests.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="card">
            <h2>Réseaux sociaux</h2>
            <div className="platforms-grid">
              {influencer.platforms &&
                Object.entries(influencer.platforms).map(([name, data], index) => {
                  const Icon = getPlatformIcon(name);
                  return (
                    <a
                      key={index}
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-card"
                    >
                      <Icon className="platform-icon" />
                      <div className="platform-followers">{data.followers}</div>
                      <div className="platform-name">{capitalize(name)}</div>
                      <div className="platform-engagement">Profil officiel</div>
                    </a>
                  );
                })}
            </div>
          </section>

          <section className="card">
            <h2>Statistiques</h2>
            <div className="stats-grid">
              <div className="stat-block">
                <div className="stat-value">{influencer.stats?.totalReach || '—'}</div>
                <div className="stat-label">Portée totale</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{influencer.stats?.avgEngagement || '—'}</div>
                <div className="stat-label">Engagement moyen</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{influencer.stats?.campaignsThisYear || '—'}</div>
                <div className="stat-label">Campagnes 2024</div>
              </div>
              <div className="stat-block">
                <div className="stat-value">{influencer.stats?.brandsSatisfaction || '—'}</div>
                <div className="stat-label">Satisfaction marques</div>
              </div>
            </div>
          </section>

          {influencer.recentCollaborations?.length > 0 && (
            <section className="card">
              <h2>Collaborations récentes</h2>
              <ul className="collab-list">
                {influencer.recentCollaborations.map((c) => (
                  <li key={c.id}>
                    <strong>{c.campaign}</strong> avec {c.brand} — {c.date}
                    <br />
                    Portée : {c.reach} • Engagement : {c.engagement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="sidebar">
          <section className="card">
            <h3>Informations</h3>
            <p><MapPin className="icon-xs" /> {influencer.location}</p>
            <p><Users className="icon-xs" /> {influencer.age} ans</p>
            <p><Calendar className="icon-xs" /> Membre depuis {influencer.joinDate}</p>
            <p><Globe className="icon-xs" /> {influencer.languages?.join(', ') || '—'}</p>
          </section>

          <section className="card">
            <h3>Performance</h3>
            <p>Note moyenne : {influencer.rating}</p>
            <p>Abonnés totaux : {influencer.followers}</p>
            <p>Collaborations : {influencer.collaborations}</p>
            <p>Engagement moyen : {influencer.engagement}</p>
          </section>

          <section className="card">
            <h3>Tarifs</h3>
            <p>Post Instagram : {influencer.rates?.post || '—'}</p>
            <p>Story Instagram : {influencer.rates?.story || '—'}</p>
            <p>Reel Instagram : {influencer.rates?.reel || '—'}</p>
            <p>Vidéo YouTube : {influencer.rates?.video || '—'}</p>
          </section>

          <section className="card">
            <button className="btn-main" onClick={handleContactClick}>
              Contacter cet influenceur
            </button>
            <button className="btn-outline" onClick={toggleFavorite}>
              {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </button>
            <p className="info-note">
              Connectez-vous pour contacter cet influenceur ou consulter vos favoris.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProfileDetail;
