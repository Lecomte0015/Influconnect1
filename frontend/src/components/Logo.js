import React from 'react'
import logo1 from '../assets/logo1.png'


const Logo = ({ className = '' }) => {
  return (
    <img
      src={logo1}
      alt="Logo Influconnect"
      className={`h-auto ${className}`}
    />
  );
};

export default Logo