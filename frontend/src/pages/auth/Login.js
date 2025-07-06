import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; 
import Logo from '../../components/Logo';




import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/login', {
        email: formData.email,
        password: formData.password,
      });
     

      // On construit un utilisateur avec un rôle standardisé
      const rawUser = res.data.user;
      console.log("Utilisateur brut reçu :", rawUser);
      const user = {
        ...rawUser,
        role: rawUser._type === 'business' ? 'brand' : 'influencer',
      };
      

      localStorage.setItem('users', JSON.stringify(user));
      localStorage.setItem('token', res.data.token); 


      if (user.role === 'brand') {
        navigate('/brand/dashboard');
      } else {
        navigate('/influencer/dashboard');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <Logo className="logo-login" />
        <h2 className="login-title">Connexion à votre compte</h2>
        <p className="login-subtext">
          Ou{' '}
          <a href="/register" className="link">
            créez un nouveau compte
          </a>
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-wrapper">
              <Mail className="icon input-icon" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="Votre adresse email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="icon input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input"
                placeholder="Entrez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
              </button>
            </div>
          </div>

          <div className="form-remember">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Se souvenir de moi
            </label>
            <a href="/ForgotPassword" className="link small-link">
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="submit-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
