import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import AdvantagesSection from "../components/AdvantagesSection";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";





const Home = () => {
  return (
    <div className="hero-container">
      <HeroSection /> 
      <div className="adv">
      <HowItWorks/>
      </div>
      <AdvantagesSection/>
      <PricingSection/>
      <TestimonialsSection/> 
      
    </div>
  );
};

export default Home;