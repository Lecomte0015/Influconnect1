import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo1.png';
import { FiMenu, FiX } from 'react-icons/fi';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="main-header">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Influconnect Logo" className="logo-image" />
        </NavLink>
      </div>

      <button className="burger-button" onClick={toggleMenu}>
        {menuOpen ? <FiX/> : <FiMenu/>}
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
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
