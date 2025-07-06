import React from "react";
import { Link } from "react-router-dom"; // ✅ Import ajouté
import { IoSearchOutline, IoPersonCircleOutline } from "react-icons/io5";
import { FaRegHandshake } from "react-icons/fa";

const steps = [
  { id: 1, number: "1", icon: <IoPersonCircleOutline />, title: "Créez votre profil", description: "Remplissez votre profil avec vos informations essentielles, vos réseaux sociaux et vos domaines d'expertise." },
  { id: 2, number: "2", icon: <IoSearchOutline />, title: "Découvrez ou soyez découvert", description: "Explorez notre base de données ou attendez que les bonnes opportunités viennent à vous." },
  { id: 3, number: "3", icon: <FaRegHandshake />, title: "Collaborez en toute simplicité", description: "Discutez, négociez et collaborez directement sur notre plateforme sécurisée." },
];

const HowItWorks = () => {
  return (
    <div className="advantage-section">
      <h1 className="maclass-h1">Comment ça marche ?</h1>
      <p>Notre plateforme simplifie chaque étape du processus de collaboration entre marques et influenceurs.</p>

      <section className="works">
        {steps.map((step) => (
          <div key={step.id} className="div-2">
            <div className="number-circle">{step.number}</div>
            <div className="icon-container">{step.icon}</div>
            <h3 className="maclass-h2">{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </section>

      {/* ✅ Lien stylisé comme un bouton */}
      <div className="button-container">
        <Link to="/register" className="main-button">
          Commencer maintenant
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
