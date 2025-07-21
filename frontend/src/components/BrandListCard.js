import React from "react";
import { Link } from "react-router-dom";
import { Award, Star, Users, Building2 } from "lucide-react";

const BrandListCard = ({ brands }) => {
  return (
    <div className="brand-grid">
      {brands.map((brand) => (
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
                <span className="label">Budget: <span className="value1">{brand.budget}</span></span>
              </div>
              <Link to={`/brand/${brand.id}`} className="view-profile">
                Voir le profil
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandListCard;
