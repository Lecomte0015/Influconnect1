import React from 'react';
import ChoiceButton from './ChoiceButton';


const HeroSection = () => {
  
  return (
    <div className="hero-section">
      <h1 className='home-h1'>
        Collaborez avec les <span className="span-1">influenceurs</span><br />
        les plus adaptés à votre marque
      </h1>
      <h2>
        Une plateforme pensée pour simplifier les collaborations et créer des
        partenariats vrais, durables et performants.
      </h2>
      <ChoiceButton />
    
      
    </div>
  );
};

export default HeroSection;
