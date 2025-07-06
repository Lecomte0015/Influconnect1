import React from 'react';
import { Check, X } from 'lucide-react';


const PricingCard = ({ plan, isAnnual }) => {
  const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
  const suffix = isAnnual ? "/an" : "/mois";

  return (
    <div className={`pricing-card ${plan.popular ? "popular" : ""}`}>
      {plan.popular && <span className="badge">Populaire</span>}

      <h3 className="plan-titre">{plan.type}</h3>
      <p className="plan-description">{plan.description}</p>

      <p className="plan-price">
        {price === 0 ? "Gratuit" : `${price}€`}
        {price !== 0 && <span className="price-suffix"> {suffix}</span>}
      </p>
      {price !== 0 && isAnnual && (
          <p className="plan-info">Facturé annuellement</p>
        )}

       
      <button className="plan-btn">Commencer maintenant</button>

      <div className="features-section">
        <h4>Inclus :</h4>
        <ul className="plan-features">
          {plan.features.map((feat, i) => (
            <li key={i} className="feature-item included">
              <Check size={16}/> {feat}
            </li>
          ))}
        </ul>

        {plan.notIncluded && plan.notIncluded.length > 0 && (
          <>
            <h4>Non inclus :</h4>
            <ul className="plan-features1">
              {plan.notIncluded.map((item, i) => (
                <li key={i} className="feature-item not-included">
                  <X size={16} /> {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
