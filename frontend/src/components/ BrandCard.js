import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Globe, Star,Award } from 'lucide-react';

const BrandCard = ({ data }) => {
  return (
    <Link to={`/brand/${data.id}`} className="card-link">
      <div className="brand-card">

        <div>
            <img src={data.image}
            alt={data.name}
            className="card-img" 
            />
            {data.verified &&(
              <div className="">
                <Award className=""/>
                Vérifié
              </div>
            )}
        </div>
        <div className="cat-rating">
            <div>
              <h3>{data.name}</h3>
              <h4 className="card-category">{data.category}</h4>
            </div>
            <div>
              <Star/>
              <span>{data.rating}</span>
            </div>
        </div>

        <div className="colab-abonné">
            <span className="test-sm">{data.collaborations}Collaborations</span>
            {data.type === 'brand'}
        </div>

        <div className="links-socials">     
          <a href={data.socials.instagram} className="insta-icone">
            <Instagram/>
          </a>
          <a href={data.socials.facebook} className="facbk-icone">
            <Facebook/>
          </a>
          <a href={data.socials.website} className="globe-icone">
            <Globe/>
          </a>
          <a href="b" className="card-btn-v">Voir la marque</a>
        </div>       
      </div>
    </Link>
  );
};

export default BrandCard;
