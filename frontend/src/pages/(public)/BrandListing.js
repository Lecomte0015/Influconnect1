import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Award, Star, Users, Building2 } from 'lucide-react';

const BrandListing = () => {
  const [formSearchTerm, setFormSearchTerm] = useState('');
  const [formSelectedIndustry, setFormSelectedIndustry] = useState('Tous');
  const [formSortBy, setFormSortBy] = useState('rating');

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState(['Tous']);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/sectors');
        setIndustries(['Tous', ...res.data]);
      } catch (error) {
        console.error("Erreur récupération secteurs :", error);
      }
    };
    fetchIndustries();
  }, []);

  const fetchBrands = async (search = '', industry = 'Tous', sort = 'rating') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/brands-full', {
        params: { search, industry, sort }
      });
      setBrands(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des marques :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBrands(formSearchTerm, formSelectedIndustry, formSortBy);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="brand-listing-page">
      <div className="container">
        <header className="header">
          <h1>Découvrez nos marques partenaires</h1>
          <p>Explorez notre sélection de marques vérifiées et <br />
            trouvez les partenariats parfaits pour votre audience</p>
        </header>

        <form className="filters1" onSubmit={handleSubmit}>
          <div className="filter-grid1">
            <div className="search-container">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Rechercher une marque..."
                value={formSearchTerm}
                onChange={(e) => setFormSearchTerm(e.target.value)}
              />
            </div>

            <select value={formSelectedIndustry} onChange={(e) => setFormSelectedIndustry(e.target.value)}>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <select value={formSortBy} onChange={(e) => setFormSortBy(e.target.value)}>
              <option value="rating">Trier par note</option>
              <option value="collaborations">Trier par collaborations</option>
              <option value="name">Trier par nom</option>
            </select>

            <button type="submit">Recherche</button>
          </div>
        </form>

        <div className="results-count">
          {loading ? 'Chargement...' : `${brands.length} marque${brands.length > 1 ? 's' : ''} trouvée${brands.length > 1 ? 's' : ''}`}
        </div>

        <div className="brand-grid">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand.id} className="brand-card">
                <div className="brand-image-container">
                <img
                      src={brand.logo}
                      alt={brand.name}
                      className="card-image"
                    />
                  {brand.verified === 1 && (
                    <div className="verified-badge">
                      <Award className="icon-small" />
                      Vérifié
                    </div>
                  )}

                  <div className="industry-badge">
                    <span>{brand.business_sector}</span>
                  </div>
                </div>

                <div className="brand-content">
                  <div className="brand-header">
                    <div>
                      <h3 className="brand-title">{brand.business_name}</h3>
                      <p className="brand-location">{brand.city}, {brand.country}</p>
                    </div>
                    <div className="brand-rating">
                      <Star className="icon-small star-icon" />
                      <span>{brand.rating}</span>
                    </div>
                  </div>

                  <p className="brand-description">{brand.bio}</p>

                  <div className="brand-meta">
                    <div className="meta-item">
                      <Users className="icon-small" />
                      <span>{brand.collaborations ?? 0} collaborations</span>
                    </div>
                    <div className="meta-item">
                      <Building2 className="icon-small" />
                      <span>Depuis {new Date(brand.created_at).getFullYear()}</span>
                    </div>
                  </div>

                  <div className="brand-footer">
                    <div className="brand-budget">
                      <span className="label"> Budget: <span className="value1">{brand.budget}</span>  </span>
                      
                    </div>
                    <Link to={`/brand/${brand.id}`} className="view-profile">
                      Voir le profil
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="no-results">
                <Building2 className="big-icon" />
                <h3>Aucune marque trouvée</h3>
                <p>Essayez de modifier vos critères de recherche.</p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default BrandListing;
