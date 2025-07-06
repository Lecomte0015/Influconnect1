import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Camera, MapPin, Globe, Instagram, Twitter, Youtube, Phone, Mail,
  Calendar, Languages, Tag, DollarSign, Save, ArrowLeft
} from 'lucide-react';
import { calculateProfileScore } from '../../utils/profileUtils'; 
import ImageUploader from '../../ImageUploader';




const InfluencerProfileCompletion = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("users"));
  const userId = user?.id;
  const token = localStorage.getItem("token"); 




  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', bio: '',présentation: '', birthdate: '', gender: '', city: '' , country: '',phone: '', email: '', languages: [],
    category: '', interests: [], experience: '', collaborations: '', 
    instagram: '', tiktok: '', youtube: '', twitter: '', website: '',
    postRate: '', storyRate: '', reelRate: '', videoRate: '',
    collaborationTypes: [], availability: '', minBudget: ''
  });

  const [progress, setProgress] = useState({ score: 0, percentage: 0, isComplete: false }); 

  useEffect(() => {
    const profile = { ...formData, photo: profileImage };
    const result = calculateProfileScore(profile);
    setProgress(result);
  }, [formData, profileImage]); // Calcul auto à chaque changement

  useEffect(() => {
    if (formData.photo) setProfileImage(formData.photo);
    if (formData.cover_image) setCoverImage(formData.cover_image);
  }, [formData.photo, formData.cover_image]);
  



  const categories = [
    'Lifestyle & Mode', 'Beauté & Bien-être', 'Tech & Gaming', 'Voyage & Aventure',
    'Fitness & Nutrition', 'Business & Finance', 'Art & Culture',
    'Famille & Parentalité', 'Cuisine & Gastronomie', 'Automobile', 'Immobilier', 'Éducation'
  ];

  const interests = [
    'Mode durable', 'Beauté naturelle', 'Technologie', 'Gaming', 'Voyage responsable',
    'Fitness', 'Nutrition', 'Bien-être', 'Entrepreneuriat', 'Investissement',
    'Art', 'Musique', 'Photographie', 'Cuisine', 'Vin', 'Automobile',
    'Sport', 'Lecture', 'Cinéma', 'Décoration'
  ];

  const collaborationTypes = [
    'Posts sponsorisés', 'Stories sponsorisées', 'Reels/Vidéos', 'Tests de produits',
    'Événements', 'Ambassadeur de marque', 'Collaborations long terme', 'Takeover de compte'
  ];

  const languageOptions = [
    'Français', 'Anglais', 'Espagnol', 'Italien', 'Allemand',
    'Portugais', 'Mandarin', 'Japonais', 'Arabe', 'Russe'
  ];

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

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem("users"));
    const token = localStorage.getItem("token");
    const userId = user?.id;

    //  Met à jour les infos de profil dans la BDD
    await fetch(`http://localhost:3001/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        firstname: formData.firstname,
        lastname: formData.lastname,
        bio: formData.bio,
        présentation: formData.présentation,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        youtube: formData.youtube,
        pricing: formData.pricing,
        profileImage,
        coverImage
      })
    });

    //  Marque le profil comme complet
    await fetch(`http://localhost:3001/api/user/${userId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      }
    });

    //  Redirige ou affiche une notification
    alert("Profil mis à jour avec succès !");
    navigate('/influencer/dashboard'); 

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Erreur lors de la sauvegarde : " + error.message);
  }
};


  

  return (
    <div className="upc-container">
      <div className="upc-wrapper">
        <div className="upc-header">
          <button onClick={() => navigate('/influencer/dashboard')} className="icon-button">
            <ArrowLeft className="icon" />
          </button>
          <div>
            <h1 className="title">Complétez votre profil</h1>
            <p className="subtitle">Ajoutez vos informations pour optimiser votre visibilité</p>
          </div>
        </div>

        {!progress.isComplete && ( 
          <div className="progress-wrapper">
            <div className="progress-label">
              Complétion du profil : {progress.percentage}%
            </div>
            <div className="progress-bar-background">
              <div
                className="progress-bar-foreground"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
          <form onSubmit={handleSubmit} className="form-section">
          

          <div className="card">
            <h2 className="section-title">Photos de profil</h2>
            <div className="grid-2">

              {/* Avatar */}
              <div>
                <label className="label">Photo de profil</label>
                <div className="image-upload">
                  <div className="profile-circle">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="img-cover" />
                    ) : (
                      <User className="icon placeholder" />
                    )}

                    <ImageUploader
                      type="photo"
                      userId={formData.id}
                      onUploadSuccess={(url) => {
                        setFormData((prev) => ({ ...prev, photo: url }));
                        setProfileImage(url); 
                      }}
                    >
                      {() => (
                        <label className="upload-button">
                          <Camera className="upload-icon" />
                        </label>
                      )}
                    </ImageUploader>

                  </div>
                </div>
              </div>

              {/* Couverture */}
              <div>
                <label className="label">Image de couverture</label>
                <div className="image-upload">
                  <div className="image-preview wide">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover" className="img-cover" />
                    ) : (
                      <Camera className="icon placeholder" />
                    )}

                    <ImageUploader
                      type="cover"
                      userId={formData.id}
                      onUploadSuccess={(url) => {
                        setFormData((prev) => ({ ...prev, cover_image: url }));
                        setCoverImage(url); 
                      }}
                    >
                      {() => (
                        <label className="upload-button cover-btn">
                          <Camera className="upload-icon" />
                        </label>
                      )}
                    </ImageUploader>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Informations personnelles */}
          <div className="card">
            <h2 className="section-title">Informations personnelles</h2>
            <div className="grid-2">
              <div>
                <label className="label">Prénom *</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Nom *</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Date de naissance</label>
                <input
                  type="date"
                  name="Birthdate"
                  value={formData.dateOfbirth}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Genre</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="label">Localisation *</label>
                <div className="input-icon-wrapper">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    name="city,country"
                    value={formData.city.country}
                    onChange={handleChange}
                    placeholder="Ville, Pays"
                    required
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Téléphone</label>
                <div className="input-icon-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 "
                    className="input has-icon"
                  />
                </div>
              </div>
            </div>

            <div className="mt">
              <label className="label">Présentation / Description *</label>
              <textarea
                name="présentation"
                value={formData.présentation}
                onChange={handleChange}
                rows="4"
                placeholder="Décrivez-vous en quelques mots..."
                required
                className="textarea"
              />
            </div>

            <div className="mt">
              <label className="label">Langues parlées</label>
              <div className="chip-container">
                {languageOptions.map(languages => (
                  <button
                    key={languages}
                    type="button"
                    onClick={() => handleArrayToggle(formData.languages, languages, 'languages')}
                    className={`chip ${formData.languages.includes(languages) ? 'chip-active' : ''}`}
                  >
                    {languages}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Informations professionnelles */}
          <div className="card">
            <h2 className="section-title">Informations professionnelles</h2>
            <div className="grid-2">
              <div>
                <label className="label">Catégorie principale *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Expérience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="experimente">Expérimenté</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="mt">
              <label className="label">Centres d'intérêt</label>
              <div className="chip-container">
                {interests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleArrayToggle(formData.interests, interest, 'interests')}
                    className={`chip ${formData.interests.includes(interest) ? 'chip-active' : ''}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Types de collaborations</h2>
            <div className="chip-container">
              {collaborationTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleArrayToggle(formData.collaborationTypes, type, 'collaborationTypes')}
                  className={`chip ${formData.collaborationTypes.includes(type) ? 'chip-active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Réseaux sociaux</h2>
            <div className="grid-2">
              <div>
                <label className="label">Instagram</label>
                <div className="input-icon-wrapper">
                  <Instagram className="input-icon" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">TikTok</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="@username"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">YouTube</label>
                <div className="input-icon-wrapper">
                  <Youtube className="input-icon" />
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="Nom de la chaîne"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Twitter</label>
                <div className="input-icon-wrapper">
                  <Twitter className="input-icon" />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="@username"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div className="full-width">
                <label className="label">Site web</label>
                <div className="input-icon-wrapper">
                  <Globe className="input-icon" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://monsite.com"
                    className="input has-icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tarifs */}
          <div className="card">
            <h2 className="section-title">Tarifs (optionnel)</h2>
            <div className="grid-2">
              <div>
                <label className="label">Post Instagram (€)</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="postRate"
                    value={formData.postRate}
                    onChange={handleChange}
                    placeholder="500"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Story Instagram (€)</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="storyRate"
                    value={formData.storyRate}
                    onChange={handleChange}
                    placeholder="200"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Reel Instagram (€)</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="reelRate"
                    value={formData.reelRate}
                    onChange={handleChange}
                    placeholder="600"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Vidéo YouTube (€)</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="videoRate"
                    value={formData.videoRate}
                    onChange={handleChange}
                    placeholder="1000"
                    className="input has-icon"
                  />
                </div>
              </div>
            </div>

            <div className="grid-2 mt">
              <div>
                <label className="label">Budget minimum par collaboration (€)</label>
                <input
                  type="number"
                  name="minBudget"
                  value={formData.minBudget}
                  onChange={handleChange}
                  placeholder="500"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Disponibilité</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  <option value="immediat">Immédiatement</option>
                  <option value="1-semaine">Dans la semaine</option>
                  <option value="2-semaines">Dans 2 semaines</option>
                  <option value="1-mois">Dans le mois</option>
                  <option value="sur-demande">Sur demande</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boutons d’action */}
          <div className="profile-buttons">
            <button type="button" onClick={() => navigate('/influencer')} className="btn cancel">
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
};

export default InfluencerProfileCompletion;
