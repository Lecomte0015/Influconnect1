import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   Mail, Globe, Phone, MapPin, Award
} from 'lucide-react';

const DetailProfileBrand = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/brands/${id}`);
        const data = await response.json();
        setBrand(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la marque :', error);
      }
    };
    fetchData();
  }, [id]);

  if (!brand) {
    return (
      <div className="brand-container">
        <div className="brand-center">
          <h1 className="brand-title">Marque non trouvée</h1>
          <Link to="/BrandListing" className="brand-link">Retour à la liste des marques</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-container">
            <Link to="/BrandListing" className="back-link">← Retour aux influenceurs</Link>

      <div className="container">
        {/* Image de couverture */}
        <div className="cover-wrapper">
          {brand.cover_image && (
            <img src={brand.cover_image} alt="Cover" className="cover-image" />
          )}
          <div className="cover-overlay">
            <div className="brand-profile-box">
              {brand.logo && (
                <img src={brand.logo} alt="Logo" className="brand-avatar" />
              )}
              <div>
                <h1 className="brand-name">{brand.business_name}</h1>
                <div className="brand-tags">
                  <span className="tag-pill">{brand.business_sector}</span>
                  {brand.verified && <span className="verified-badge"><Award size={14} className="icon" /> Vérifié</span>}

                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="main-grid">
          
          <div className="left-column">
            
            <div className="card">
              <h2 className="card-title">À propos</h2>
              {brand.description && (
                <p className="card-text">{brand.description}</p>
              )}
              <div className="grid-two">
                <div>
                  <h3 className="card-subtitle">Mission</h3>
                  <p className="card-subtext">{brand.bio}</p>
                </div>
                <div>
                  <h3 className="card-subtitle">Audience cible</h3>
                  <p className="card-subtext">{brand.cible}</p>
                </div>
              </div>
              <div className="brand-values">
                <h3 className="card-subtitle">Valeurs</h3>
                <div className="pill-group">
                  {brand.tags?.map((value, index) => (
                    <span key={index} className="pill">{value}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="card">
              <h2 className="card-title">Statistiques</h2>
              <div className="grid-four">
                <div className="stat-box">
                  <div className="stat-value text-primary">{brand.stats?.totalReach}</div>
                  <div className="stat-label">Portée totale</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value text-green">{brand.stats?.avgEngagement}</div>
                  <div className="stat-label">Engagement moyen</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value text-purple">{brand.stats?.campaignsThisYear}</div>
                  <div className="stat-label">Campagnes 2024</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value text-yellow">{brand.stats?.satisfactionRate}</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
            </div>

           
            <div className="card">
              <h2 className="card-title">Campagnes récentes</h2>
              <div className="campaign-list">
                {brand.recentCampaigns?.map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <div>
                        <h3 className="campaign-title">{campaign.name}</h3>
                        <p className="campaign-sub">avec {campaign.influencer}</p>
                      </div>
                      <span className="campaign-date">{campaign.date}</span>
                    </div>
                    <div className="campaign-stats">
                      <div><strong>Portée:</strong> {campaign.reach}</div>
                      <div><strong>Engagement:</strong> {campaign.engagement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

         
          <div className="right-column">
            
            <div className="card">
              <h3 className="card-title">Informations</h3>
              <div className="info-list">
                {brand.location && <div><MapPin size={16} /> {brand.location}</div>}
                {brand.founded && <div>Fondée en {brand.founded}</div>}
                {brand.website && <div><Globe size={16} /> {brand.website}</div>}
                {brand.email && <div><Mail size={16} /> {brand.email}</div>}
                {brand.phone && <div><Phone size={16} /> {brand.phone}</div>}
              </div>
            </div>

            
            <div className="card">
              <h3 className="card-title">Performance</h3>
              <div className="info-list">
                <div>Note moyenne : <strong>{brand.rating}</strong></div>
                <div>Collaborations : <strong>{brand.collaborations}</strong></div>
                <div>Budget moyen : <strong>{brand.budget}</strong></div>
              </div>
            </div>

            
            <div className="card">
              <button className="contact-button">Contacter cette marque</button>
              <p className="contact-note">Connectez-vous pour envoyer un message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfileBrand;
