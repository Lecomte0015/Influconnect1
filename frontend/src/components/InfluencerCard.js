import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Globe, Star,Award } from 'lucide-react';


const InfluencerCard = ({ data }) => {
  return (
    <Link to={`/profil/${data.id}`} className="card-link">
      <div className="influencer-card">

        <div className="img-name">
          <img 
          src={data.image}
          alt={data.name}
          className="card-img"
          
          />
          {data.verified && (
              <div className="">
                <Award className="" />
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
            {data.type === 'influencer' && (
          <div className="text-gray-600 text-sm">
            {data.followers} abonnés
          </div>
          )} 
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
          <a href="b" className="card-btn-v">Voir le profile</a>
        </div>        
        
      </div>
    </Link>
  );
};

export default InfluencerCard;
