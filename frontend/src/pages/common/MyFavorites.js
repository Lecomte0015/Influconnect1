import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Instagram, Users, Star, Award } from 'lucide-react';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const favoritesList = await Promise.all(
          response.data.favorites.map(async (fav) => {
            const detail = await axios.get(`http://localhost:3001/api/influencer/${fav.user_id_to}`);
            return {
              ...detail.data,
              favoriteId: fav.id,
            };
          })
        );

        setFavorites(favoritesList);
      } catch (error) {
        console.error("Erreur récupération favoris :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) return <p className="loading-text">Chargement de vos favoris...</p>;

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">Mes favoris</h1>

      {favorites.length === 0 ? (
        <p className="no-favorites">Aucun influenceur ajouté en favori.</p>
      ) : (
        <div className="influencer-grid1">
          {favorites.map((influencer) => (
            <Link
              to={`/influencer/${influencer.id}`}
              key={influencer.id}
              className="influencer-card-link"
            >
              <div className="influencer-card">
                <div className="card-top">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="card-image"
                  />

                  {influencer.verified && (
                    <div className="badge-verified">
                      <Award className="icon" /> Vérifié
                    </div>
                  )}

                  {influencer.category && (
                    <div className="badge-category">{influencer.category}</div>
                  )}
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <div>
                      <h3>{influencer.name}</h3>
                      <p>{influencer.location} • {influencer.age} ans</p>
                    </div>
                    <div className="card-rating">
                      <Star className="icon-sm star" />
                      <span>{influencer.rating}</span>
                    </div>
                  </div>

                  <p className="card-description">{influencer.bio}</p>

                  <div className="card-stats">
                    <div><span>Abonnés</span><strong>{influencer.followers}</strong></div>
                    <div><span>Engagement</span><strong>{influencer.engagement || '—'}</strong></div>
                    <div><span>Collaborations</span><strong>{influencer.collaborations || '—'}</strong></div>
                    <div><span>Langues</span>
                      <strong>
                        {Array.isArray(influencer.languages) && influencer.languages.length > 0
                          ? influencer.languages.join(', ')
                          : '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="card-footer">
                  <div className="platforms">
                      <div>
                        <Instagram className="icon-sm" />
                        {influencer.platforms?.instagram?.followers
                          ? influencer.platforms.instagram.followers.toLocaleString()
                          : '—'}
                      </div>
                      <div>
                        <Users className="icon-sm" />
                        {influencer.platforms?.tiktok?.followers
                          ? influencer.platforms.tiktok.followers.toLocaleString()
                          : '—'}
                      </div>
                    </div>
                    <span className="btn-profile disabled">Voir le profil</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
