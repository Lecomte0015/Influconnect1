import React from "react";

const PricingToggle = ({ isInfluencer, onToggle }) => {
  return (
    <>
    <div className="toggle-search-target">
          <button
            className={`choice-button ${!isInfluencer ? "active" : "inactive"}`}
            onClick={() => onToggle(false)}
          >
            Pour les marques
          </button>
          <button
            className={`choice-button ${isInfluencer ? "active" : "inactive"}`}
            onClick={() => onToggle(true)}
          >
            Pour les influenceurs
        </button>
      
      
    </div>
    </>
  );
};

export default PricingToggle;
