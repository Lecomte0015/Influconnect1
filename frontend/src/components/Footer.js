import React from 'react';
import { NavLink } from 'react-router-dom'; 
import logo2 from '../assets/logo2.png'; 


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">

          {/* description Column */}
          <div className="footer-logo-section">
              <div className="logo">
                <NavLink to="/">
                  <img src={logo2} alt="Influconnect Logo" className="logo-image1" />
                </NavLink>
              </div>
                <p className="footer-p1">
                  La plateforme qui connecte les marques aux influenceurs qui comptent.
                </p>
          </div>


          
          <div>
            <h3 className="section-title">Liens rapides</h3>
            <ul className="links-list">
              <li><a href="#">Accueil</a></li>
              <li><a href="/brandlisting">Pour les marques</a></li>
              <li><a href="/influencerslisting">Pour les influenceurs</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">À propos</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="section-title">Contact</h3>
          </div>

          
          <div>
            <h3 className="section-title">Newsletter</h3>
            <p className="footer-p">
              Abonnez-vous pour recevoir nos dernières actualités et offres.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Votre email" className="input" />
              <button type="submit" className="button">S'abonner</button>
            </form>
          </div>
        </div>
        {/* les liens politique */}
        <div className="footer-bottom">
          <p className="footer-p">&copy; {new Date().getFullYear()} InfluConnect. Tous droits réservés.</p>
          <div className="legal-links">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
