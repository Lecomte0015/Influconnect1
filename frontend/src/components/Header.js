import React from 'react';
import { NavLink } from 'react-router-dom'; 
import logo from '../assets/logo1.png'; 

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Influconnect Logo" className="logo-image" />
        </NavLink>
      </div>
      <nav className="nav-links">
        <ul className="nav-list">
          <li><NavLink to="/how-it-works">Comment ça marche ?</NavLink></li>
          <li><NavLink to="/brandlisting">Les Marques</NavLink></li>
          <li><NavLink to="/influencerslisting">Les Influenceurs</NavLink></li>
          <li><NavLink to="/login">Connexion</NavLink></li>
          <li><NavLink to="/register" className="signup-button">Inscription</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
