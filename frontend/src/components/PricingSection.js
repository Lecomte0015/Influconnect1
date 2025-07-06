import React, { useState } from "react";


import { influencerPlans, brandPlans } from "../data/pricingData";
import PricingCard from "./PricingCard";
import PricingToggle from "./PricingToggle";
import PricingPeriodToggle from "./PricingPeriodToggle";

const PricingSection = () => {
  const [isInfluencer, setIsInfluencer] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);

  const PlansToDisplay = isInfluencer ? influencerPlans : brandPlans;

  return (
    <section className="pricing-section">
      <div className="advantage-section">
        <h1 className="maclass-h1">Des tarifs adaptés à vos besoins</h1>
        <p>Choississez le plan qui correspond le mieux à vos objectifs.</p>
      </div>
      <PricingToggle
        isInfluencer={isInfluencer}
        onToggle={() => setIsInfluencer(!isInfluencer)}
      />

      <PricingPeriodToggle
        isAnnual={isAnnual}
        onToggle={setIsAnnual}
      />

      <div className="works-card">
        {PlansToDisplay.map((plan, index) => (
          <PricingCard key={index} plan={plan} isAnnual={isAnnual} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
