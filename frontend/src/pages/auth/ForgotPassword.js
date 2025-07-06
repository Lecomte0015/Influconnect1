import React, { useState } from 'react';
import Logo from '../../components/Logo';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Logo className="logo-login" />
        <h2 className="login-title">Mot de passe oublié</h2>
        <p className="login-subtext">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="Votre adresse email"
            />
          </div>

          <button type="submit" className="submit-btn">
            Envoyer le lien
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
