import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo'; 


import { Mail, Lock, Eye, EyeOff, User, Building2 } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState('influencer');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    businessNumber: '',
    siret: '',
    brand: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }
  
    try {
      // ici je convertir "brand" en "business" 
      const formattedAccountType = accountType === 'brand' ? 'business' : accountType;
  
      
      const res = await axios.post('http://localhost:3001/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        accountType: formattedAccountType, 
        brand: formData.brand || null,
        businessNumber: formData.businessNumber || null,
        businessSector: formData.businessSector || null,
        taxId: formData.taxId || null
      });
  
      console.log('Inscription réussie:', res.data);
      
      console.log('Réponse API Inscription:', res.data);
      navigate('/login');
  
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Une erreur est survenue lors de l’inscription.");
      }
    }
  };
  

  return (
    <div className="register-container">
      <div className="register-box">
      <Logo className="logo-login" />
        <h2 className="register-title">Créer un compte</h2>
        <p className="register-subtext">
          Ou <a href="/login">connectez-vous à votre compte existant</a>
        </p>

        <div className="account-type-buttons">
          <button
            type="button"
            onClick={() => setAccountType('influencer')}
            className={accountType === 'influencer' ? 'active' : 'inactive'}
          >
            Influenceur
          </button>
          <button
            type="button"
            onClick={() => setAccountType('brand')}
            className={accountType === 'brand' ? 'active' : 'inactive'}
          >
            Marque
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">

          {/* Champs spécifiques à l'influenceur */}
          {accountType === 'influencer' ? (
            <>
              
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <div className="input-wrapper">
                  <User className="icon" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              
              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <div className="input-wrapper">
                  <User className="icon" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          ) : (
            // Champ pour marque
            <div className="form-group">
              <label htmlFor="brand">Nom de la marque</label>
              <div className="input-wrapper">
                <Building2 className="icon" />
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  required
                  placeholder="Nom de votre entreprise"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-wrapper">
              <Mail className="icon" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Entrez votre adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <Lock className="icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          
          {accountType === 'brand' && (
            <>
              <div className="form-group">
                <label htmlFor="businessNumber">Numéro d'entreprise</label>
                <div className="input-wrapper">
                  <input
                    id="businessNumber"
                    name="businessNumber"
                    type="text"
                    placeholder="Ex: TVA123456"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="siret">Numéro SIRET</label>
                <div className="input-wrapper">
                  <input
                    id="siret"
                    name="siret"
                    type="text"
                    placeholder="Ex: 12345678900010"
                    value={formData.siret}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          
          <div className="form-terms">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              id="acceptTerms"
            />
            <label htmlFor="acceptTerms">
              J'accepte les <a href="/terms">conditions d'utilisation</a> et la <a href="/privacy">politique de confidentialité</a>
            </label>
          </div>

          
          <button type="submit" className="submit-btn">Créer un compte</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
