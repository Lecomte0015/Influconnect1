import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import ajouté
import { FaBullseye, FaChartLine, FaShieldAlt, FaMoneyBillWave, FaStar, FaDollarSign, FaEye, FaGift } from 'react-icons/fa';

const AdvantagesSection = () => {
  return (
    <>
      <div className='advantage-section'>
        <h1 className='maclass-h1'>Des avantages pour tous</h1>
        <p>Notre plateforme est conçue pour répondre aux besoins spécifiques des marques et des influenceurs.</p>
      </div>

      <section className='avantage'>
        {/* Carte Influenceur */}
        <div className='div-ad'>
          <div className="titre-ad">
            <h2 className='maclass-ad2'>Pour les influenceurs</h2>
          </div>
          <ul>
            <li><div className='advantage-influ'><FaStar className='icone' /><h4>Opportunités exclusives</h4></div><p className='polo'>Accédez à des collaborations avec des marques de premier plan dans votre niche.</p></li>
            <li><div className='advantage-influ'><FaDollarSign className='icone' /><h4>Revenus constants</h4></div><p className='polo'>Développez des sources de revenus stables avec des partenariats durables.</p></li>
            <li><div className='advantage-influ'><FaEye className='icone' /><h4>Visibilité accrue</h4></div><p className='polo'>Faites-vous remarquer par plus de marques et augmentez votre visibilité.</p></li>
            <li><div className='advantage-influ'><FaGift className='icone' /><h4>Avantages exclusifs</h4></div><p className='polo'>Bénéficiez d'offres spéciales réservées aux membres de notre communauté.</p></li>
          </ul>

          {/* ✅ Redirection vers /register */}
          <Link to="/register" className='btn-influenceur'>
            Créez votre profil d'influenceur
          </Link>
        </div>

        {/* Carte Marque */}
        <div className='div-ad'>
          <div className="titre-ad">
            <h2 className='maclass-ad1'>Pour les marques</h2>
          </div>
          <ul>
            <li><div className='advantage-influ'><FaBullseye className='icone' /><h4>Ciblage précis</h4></div><p className='polo'>Trouvez les influenceurs parfaitement alignés avec votre audience cible.</p></li>
            <li><div className='advantage-influ'><FaChartLine className='icone' /><h4>Mesure de performance</h4></div><p className='polo'>Accédez à des analyses détaillées sur vos campagnes.</p></li>
            <li><div className='advantage-influ'><FaShieldAlt className='icone' /><h4>Sécurité garantie</h4></div><p className='polo'>Contrats sécurisés et paiements protégés pour chaque collaboration.</p></li>
            <li><div className='advantage-influ'><FaMoneyBillWave className='icone' /><h4>ROI optimisé</h4></div><p className='polo'>Maximisez votre retour sur investissement avec nos outils d'optimisation.</p></li>
          </ul>

          {/* ✅ Redirection vers /register */}
          <Link to="/register" className='btn-marque'>
            Inscrivez votre marque
          </Link>
        </div>
      </section>
    </>
  );
};

export default AdvantagesSection;
