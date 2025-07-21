import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Star, Award, Instagram } from 'lucide-react';
import axios from 'axios';

const InfluencersListing = () => {
  const [influencers, setInfluencers] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [tempSearch, setTempSearch] = useState('');
  const [tempCategory, setTempCategory] = useState('Tous');
  const [tempSort, setTempSort] = useState('followers');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/influencer-tags');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
    }
  };

  const fetchInfluencers = async (search = '', category = '', sort = 'followers') => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/influencers', {
        params: {
          search,
          category: category !== 'Tous' ? category : '',
          sort,
        },
      });
      console.log(response.data)
      setInfluencers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des influenceurs :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    fetchInfluencers(tempSearch, tempCategory, tempSort);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchInfluencers(tempSearch, tempCategory, tempSort);
    }
  };

  
  

  useEffect(() => {
    fetchCategories(); 
    fetchInfluencers(); 
  }, []);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>Découvrez nos influenceurs</h1>
          <p>
            Explorez notre communauté d'influenceurs talentueux et trouvez les
            créateurs parfaits pour votre marque.
          </p>
        </div>

        <div className="filters">
          <div className="filter-grid">
            <div
              className="search-container"
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <Search className="icon" />
              <input
                type="text"
                placeholder="Rechercher un influenceur..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <select
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={tempSort}
              onChange={(e) => setTempSort(e.target.value)}
            >
              <option value="followers">Trier par abonnés</option>
              <option value="rating">Trier par note</option>
              <option value="name">Trier par nom</option>
            </select>

            <button
              className="search-button"
              onClick={handleSearchClick}
              style={{
                backgroundColor: '#06b6d4',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Rechercher
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <>
            <p className="results-count">
              {influencers.length} influenceur
              {influencers.length > 1 ? 's' : ''} trouvé
            </p>

            <div className="influencer-grid">
                {influencers.map((influencer) => (
                  <div key={influencer.id} className="influencer-card">
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
                          <div><Instagram className="icon-sm" /> {influencer.platforms?.instagram || '—'}</div>
                          <div><Users className="icon-sm" /> {influencer.platforms?.tiktok || '—'}</div>
                        </div>
                        <Link to={`/influencer/${influencer.id}`} className="btn-profile">
                          Voir le profil
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            {influencers.length === 0 && (
              <div className="no-results">
                <Users className="icon-lg" />
                <h3>Aucun influenceur trouvé</h3>
                <p>Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InfluencersListing;
