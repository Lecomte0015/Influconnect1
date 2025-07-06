import React from "react";

const PricingPeriodToggle = ({ isAnnual, onToggle }) => {
  return (
    <div className="pricing-toggle-wrapper">
      <span className="toggle-label">Mensuel</span>

      <div className="toggle-switch" onClick={() => onToggle(!isAnnual)}>
        <div className={`toggle-handle ${isAnnual ? "right" : "left"}`}></div>
      </div>

      <span className="toggle-label">
        Annuel <span className="discount">-20%</span>
      </span>
    </div>
  );
};

export default PricingPeriodToggle;
