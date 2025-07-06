// src/pages/confirm/EmailRedirect.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailRedirect = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/confirm/${token}`)
      .then(res => {
        
      })
      .catch(err => {
        console.error("Erreur de confirmation :", err);
        navigate("/email-error");
      });
  }, [token, navigate]);

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Confirmation en cours...</h2>
    </div>
  );
};

export default EmailRedirect;
