import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // Redirection vers la page de connexion
    }, 3000); // 3 secondes

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Email confirmé avec succès </h1>
      <p>Redirection vers la page de connexion...</p>
    </div>
  );
};

export default EmailConfirmed;
