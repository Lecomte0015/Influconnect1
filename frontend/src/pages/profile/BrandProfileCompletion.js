import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Camera, Globe, Instagram, Twitter, Linkedin, Phone, Mail,
  ArrowLeft, Users, Save,
} from 'lucide-react';

const BrandProfileCompletion = () => {
  const navigate = useNavigate();
  const [logoImage, setLogoImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [completion, setCompletion] = useState(0);

  const [formData, setFormData] = useState({
    companyName: '',
    brandName: '',
    description: '',
    mission: '',
    foundedYear: '',
    companySize: '',
    industry: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    contactPerson: '',
    contactRole: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    targetAudience: '',
    values: [],
    collaborationTypes: [],
    budgetRange: '',
    campaignObjectives: [],
    preferredInfluencerTypes: [],
    minFollowers: '',
    maxCollaborationsPerMonth: '',
    averageCampaignDuration: '',
  });

  const industries = [ 
    'Cosmétique & Beauté',
    'Mode & Accessoires',
    'Technologie',
    'Alimentation & Boissons',
    'Sport & Fitness',
    'Voyage & Tourisme',
    'Automobile',
    'Immobilier',
    'Santé & Bien-être',
    'Éducation',
    'Finance & Assurance',
    'Divertissement',
    'Luxe',
    'Maison & Décoration',
    'Services B2B',
    'Autre'
  ];
  const companySizes = [
    '1-10 employés',
    '11-50 employés',
    '51-200 employés',
    '201-500 employés',
    '501-1000 employés',
    '1000+ employés'
  ];
  const valuesList = [
    'Durabilité', 'Innovation', 'Qualité', 'Transparence', 'Authenticité',
    'Inclusivité', 'Responsabilité sociale', 'Excellence', 'Créativité',
    'Tradition', 'Modernité', 'Accessibilité', 'Luxe', 'Simplicité'
  ];
  const collaborationTypes = [
    'Posts sponsorisés',
    'Stories sponsorisées',
    'Reels/Vidéos',
    'Tests de produits',
    'Événements',
    'Ambassadeur de marque',
    'Collaborations long terme',
    'Takeover de compte',
    'Concours/Jeux',
    'Unboxing',
    'Tutoriels',
    'Reviews'
  ];
  const campaignObjectives = [
    'Notoriété de marque',
    'Génération de leads',
    'Ventes directes',
    'Engagement communauté',
    'Lancement de produit',
    'Repositionnement',
    'Acquisition de followers',
    'Trafic site web',
    'Éducation consommateur'
  ];
  const influencerTypes = [
    'Nano-influenceurs (1K-10K)',
    'Micro-influenceurs (10K-100K)',
    'Macro-influenceurs (100K-1M)',
    'Méga-influenceurs (1M+)',
    'Célébrités',
    'Experts sectoriels',
    'Créateurs de contenu'
  ];
  const budgetRanges = [
    'Moins de 1K€',
    '1K€ - 5K€',
    '5K€ - 10K€',
    '10K€ - 25K€',
    '25K€ - 50K€',
    '50K€ - 100K€',
    '100K€ - 250K€',
    'Plus de 250K€'
  ];

  // Fonction pour calculer la complétion du profil
  const calculateCompletion = () => {
    let totalPoints = 20; 
    let earnedPoints = 0;

    // Identité visuelle
    if (logoImage) earnedPoints += 1;
    if (coverImage) earnedPoints += 1;

    // Informations de base
    if (formData.companyName.trim()) earnedPoints += 1;
    if (formData.brandName.trim()) earnedPoints += 1;
    if (formData.industry.trim()) earnedPoints += 1;
    if (formData.description.trim()) earnedPoints += 1;

    // Adresse entreprise (4 champs obligatoires)
    if (formData.address.trim()) earnedPoints += 1;
    if (formData.city.trim()) earnedPoints += 1;
    if (formData.postalCode.trim()) earnedPoints += 1;
    if (formData.country.trim()) earnedPoints += 1;

    // Contact (3 champs obligatoires)
    if (formData.phone.trim()) earnedPoints += 1;
    if (formData.email.trim()) earnedPoints += 1;
    

    // Réseaux sociaux — au moins 1 ou 2 remplis  2 points max
    const socialNetworks = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok'];
    const socialsFilled = socialNetworks.filter(s => formData[s]?.trim() !== '').length;
    if (socialsFilled >= 2) earnedPoints += 2;
    else if (socialsFilled === 1) earnedPoints += 1;

    // Stratégie marketing (simplifié)
    if (formData.targetAudience.trim()) earnedPoints += 1;
    if (formData.collaborationTypes.length > 0) earnedPoints += 1;
    if (formData.campaignObjectives.length > 0) earnedPoints += 1;
    if (formData.preferredInfluencerTypes.length > 0) earnedPoints += 1;
    if (formData.budgetRange.trim()) earnedPoints += 1;
    if (formData.minFollowers.trim()) earnedPoints += 1;
    if (formData.maxCollaborationsPerMonth.trim()) earnedPoints += 1;
    if (formData.averageCampaignDuration.trim()) earnedPoints += 1;

    // Calcul pourcentage final
    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    return percentage;
  };

  // Mettre à jour la complétion à chaque changement
  useEffect(() => {
    setCompletion(calculateCompletion());
  }, [formData, logoImage, coverImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleArrayToggle = (array, value, field) => {
    const updated = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result;
        if (type === 'logo') setLogoImage(result);
        else setCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire complet', { ...formData, logoImage, coverImage });
    navigate('/brand');
  };
   
  const requiredFields = [
    'companyName', 'brandName', 'industry', 'description',
    'address', 'city', 'postalCode', 'country',
    'phone', 'email'
  ];

  // Fonctions pour vérifier si un champ est rempli
  const isFieldFilled = (field) => {
    const value = formData[field];
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };

  // Calculer nombre de champs remplis
  const filledCount = requiredFields.filter(isFieldFilled).length;

  // Pour images logo et cover je compte 1 chacun s’ils sont remplis
  const imagesCount = (logoImage ? 1 : 0) + (coverImage ? 1 : 0);

  // Nombre total de champs à remplir pour calculer la complétion
  const totalFields = requiredFields.length + 2; // +2 pour logo et cover

  // Calcul du pourcentage complété
  const profileCompletion = Math.round(((filledCount + imagesCount) / totalFields) * 100);

  // Ensuite la partie JSX complète du formulaire et interface (à coller à la suite)
  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* Barre de progression visible uniquement si < 100% */}
        {profileCompletion < 100 && (
          <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
            <div 
              className="progress-bar" 
              style={{
                width: `${profileCompletion}%`,
                height: '8px',
                backgroundColor: '#4caf50',
                borderRadius: '4px',
                transition: 'width 0.3s ease-in-out'
              }}
              aria-label={`Complétion du profil: ${profileCompletion}%`}
              role="progressbar"
            />
          </div>
)}


        <form onSubmit={handleSubmit} className="profile-form">

          <div className="profile-section">
            <h2 className="section-title">Identité visuelle</h2>
            <div className="form-grid two-cols">
              <div>
                <label>Logo de la marque</label>
                <div className="image-upload">
                  <div className="image-preview square">
                    {logoImage ? <img src={logoImage} alt="Logo" /> : <Building2 size={40} color="#ccc" />}
                  </div>
                  <label className="image-upload-btn">
                    <Camera size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} hidden />
                  </label>
                </div>
              </div>

              <div>
                <label>Image de couverture</label>
                <div className="image-upload">
                  <div className="image-preview wide">
                    {coverImage ? <img src={coverImage} alt="Cover" /> : <Camera size={20} color="#ccc" />}
                  </div>
                  <label className="image-upload-btn bottom-right">
                    <Camera size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} hidden />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Informations de base</h2>
            <div className="form-grid two-cols">
              <div>
                <label>Nom de l'entreprise *</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Nom de la marque *</label>
                <input
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Industrie *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Année de création</label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="full-width">
                <label>Taille de l'entreprise</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="full-width">
                <label>Description de l'entreprise *</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="full-width">
                <label>Mission de l'entreprise</label>
                <textarea
                  name="mission"
                  rows="3"
                  value={formData.mission}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Valeurs de l'entreprise</label>
                <div className="tag-select">
                  {valuesList.map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handleArrayToggle(formData.values, val, 'values')}
                      className={formData.values.includes(val) ? 'selected' : ''}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Adresse de l'entreprise</h2>
            <div className="form-grid two-cols">
              <div className="full-width">
                <label>Adresse *</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Ville *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Code postal *</label>
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="full-width">
                <label>Pays *</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Informations de contact</h2>
            <div className="form-grid two-cols">
              <div>
                <label className="label">Téléphone principal *</label>
                <div className="input-icon-wrapper">
                  <Phone className="input-icon"/>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Email principal *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon"/>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Site web</label>
                <div className="input-icon-wrapper">
                  <Globe className="input-icon"/>
                  <input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label>Personne de contact</label>
                <input
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Poste de la personne de contact</label>
                <input
                  name="contactRole"
                  value={formData.contactRole}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Présence sur les réseaux sociaux</h2>
            <div className="form-grid two-cols">
              <div>
                <label className="label">Instagram</label>
                <div className="input-icon-wrapper">
                  <Instagram className="input-icon" />
                  <input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">Facebook</label>
                <div className="input-icon-wrapper">
                  <Users className="input-icon"/>
                  <input
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">LinkedIn</label>
                <div className="input-icon-wrapper">
                  <Linkedin className="input-icon"/>
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">Twitter</label>
                <div className="input-icon-wrapper">
                  <Twitter className="input-icon"/>
                  <input
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">YouTube</label>
                <div className="input-icon-wrapper">
                  <Users className="input-icon"/>
                  <input
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">TikTok</label>
                <div className="input-icon-wrapper">
                  <Users className="input-icon"/>
                  <input
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Stratégie d'influence marketing</h2>
            <div className="form-grid vertical">
              <div>
                <label>Audience cible</label>
                <textarea
                  name="targetAudience"
                  rows="3"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Décrivez votre audience cible..."
                />
              </div>

              <div>
                <label>Types de collaborations recherchées</label>
                <div className="tag-select">
                  {collaborationTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleArrayToggle(formData.collaborationTypes, type, 'collaborationTypes')}
                      className={formData.collaborationTypes.includes(type) ? 'selected' : ''}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Objectifs de campagne</label>
                <div className="tag-select">
                  {campaignObjectives.map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => handleArrayToggle(formData.campaignObjectives, obj, 'campaignObjectives')}
                      className={formData.campaignObjectives.includes(obj) ? 'selected' : ''}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Types d'influenceurs préférés</label>
                <div className="tag-select">
                  {influencerTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleArrayToggle(formData.preferredInfluencerTypes, type, 'preferredInfluencerTypes')}
                      className={formData.preferredInfluencerTypes.includes(type) ? 'selected' : ''}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-grid two-cols">
              <div>
                <label>Budget par campagne</label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Nombre minimum d'abonnés</label>
                <input
                  type="number"
                  name="minFollowers"
                  value={formData.minFollowers}
                  onChange={handleChange}
                  placeholder="10000"
                />
              </div>

              <div>
                <label>Collaborations max par mois</label>
                <input
                  type="number"
                  name="maxCollaborationsPerMonth"
                  value={formData.maxCollaborationsPerMonth}
                  onChange={handleChange}
                  placeholder="5"
                />
              </div>

              <div>
                <label>Durée moyenne des campagnes</label>
                <select
                  name="averageCampaignDuration"
                  value={formData.averageCampaignDuration}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1-semaine">1 semaine</option>
                  <option value="2-semaines">2 semaines</option>
                  <option value="1-mois">1 mois</option>
                  <option value="3-mois">3 mois</option>
                  <option value="6-mois">6 mois</option>
                  <option value="1-an">1 an ou plus</option>
                </select>
              </div>
            </div>
          </div>

          <div className="profile-buttons">
            <button type="button" className="btn-secondary" onClick={() => navigate('/brand')}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              Sauvegarder le profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BrandProfileCompletion;
