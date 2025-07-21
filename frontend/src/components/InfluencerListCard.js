import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Users, Star, Award } from "lucide-react";

const InfluencerListCard = ({ influencers }) => {
  return (
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
  );
};

export default InfluencerListCard;
