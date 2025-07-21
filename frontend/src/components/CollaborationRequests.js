import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft, MessageSquare, XCircle, X, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { getCurrentUser } from '../utils/context/Auth';

const CollaborationRequests = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requests, setRequests] = useState([]);
  const [replyModalId, setReplyModalId] = useState(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const filtered = requests.filter(r => r.type === activeTab);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/messages?type=sent&userId=${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const messages = response.data?.messages || [];
        setRequests(messages.map(msg => ({
          id: msg.id,
          type: 'sent',
          status: msg.status || 'pending',
          fromUser: {
            id: currentUser.id,
            name: `${currentUser.firstname} ${currentUser.business_name}`,
            type: currentUser._type,
            image: currentUser.photo,
            logo: currentUser.logo
          },
          campaign: {
            title: 'Titre temporaire',
            description: 'Description temporaire'
          },
          message: msg.content
        })));
      } catch (err) {
        console.error('Erreur chargement messages envoyés :', err.message);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/messages?type=received&userId=${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const messages = response.data?.messages || [];
  
        const formatted = await Promise.all(messages.map(async (msg) => {
          try {
            const userRes = await api.get(`/api/users/${msg.sender_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const sender = userRes.data;
        
            return {
              id: msg.id,
              type: 'received',
              status: msg.status || 'pending',
              fromUser: {
                id: sender.id,
                name: `${sender.firstname} ${sender.lastname}`,
                type: sender._type,
                image: sender.image,
                logo: sender.logo
              },
              campaign: {
                title: msg.title || 'Campagne inconnue',
                description: msg.description || 'Pas de description disponible',
                budget: msg.budget || 0,
                deadline: msg.deadline || '',
                deliverables: msg.deliverables || []
              },
              message: msg.content,
              reply: msg.reply || null
            };
          } catch (err) {
            console.warn(`⚠️ Utilisateur introuvable pour sender_id ${msg.sender_id}`);
            return {
              id: msg.id,
              type: 'received',
              status: msg.status || 'pending',
              fromUser: {
                id: msg.sender_id,
                name: 'Utilisateur inconnu',
                type: 'unknown',
                image: null,
                logo: null
              },
              campaign: {
                title: msg.title || 'Campagne inconnue',
                description: msg.description || 'Pas de description disponible',
                budget: msg.budget || 0,
                deadline: msg.deadline || '',
                deliverables: msg.deliverables || []
              },
              message: msg.content,
              reply: msg.reply || null
            };
          }
        }));
        
  
        setRequests(prev => [...prev, ...formatted.filter(Boolean)]);
      } catch (err) {
        console.error('Erreur chargement messages reçus :', err.message);
      }
    };
  
    fetchReceivedMessages();
  }, []);
  

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const sender_id = currentUser?.id;
      if (!sender_id) throw new Error("Utilisateur non connecté");

      const recipientName = formData.recipientName.trim();
      const response = await api.get(
        `/api/users/find-by-name?name=${encodeURIComponent(recipientName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const receiver_id = response?.data?.id;
      if (!receiver_id) throw new Error("Destinataire introuvable");

      await api.post('/api/messages', {
        sender_id,
        receiver_id,
        content: formData.message,
        type: 'collaboration',
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        deadline: formData.deadline,
        deliverables: formData.deliverables
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      

      console.log(" Demande envoyée !");
      setShowNewRequest(false);
    } catch (err) {
      console.error("Erreur d'envoi :", err.message);
      alert(err.message || "Erreur lors de l’envoi de la demande");
    }
  };

  const handleAccept = (id) => {
    setReplyModalId(id); // Ouvre la modal de réponse
  };

  const handleReplySubmit = async (messageContent) => {
    try {
      const token = localStorage.getItem('token');
      const original = requests.find(r => r.id === replyModalId);
      if (!original) throw new Error("Demande introuvable");

      await api.patch(`/api/messages/${replyModalId}`, {
        status: 'accepted'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await api.post('/api/messages', {
        sender_id: currentUser.id,
        receiver_id: original.fromUser.id,
        content: messageContent,
        type: 'reply'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(prev => prev.map(r =>
        r.id === replyModalId ? { ...r, status: 'accepted', reply: messageContent } : r
      ));

      setReplyModalId(null);
      console.log("✅ Réponse envoyée !");
    } catch (err) {
      console.error("Erreur lors de la réponse :", err.message);
      alert("Erreur lors de l’envoi de la réponse.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/api/messages/${id}`, {
        status: 'rejected'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Demande refusée !");
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    } catch (err) {
      console.error("Erreur lors du refus :", err.message);
      alert("Erreur lors du refus de la demande.");
    }
  };

  if (showNewRequest) {
    return (
      <NewRequestForm
        onClose={() => setShowNewRequest(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  if (replyModalId) {
    return (
      <ReplyModal
        onClose={() => setReplyModalId(null)}
        onSubmit={handleReplySubmit}
      />
    );
  }
  return (
    <div className="request-wrapper">
      <div className="request-header">
        <div className="header-left">
          <button onClick={() => navigate('/influencer/dashboard')} className="back-button">
            <ArrowLeft />
          </button>
          <div>
            <h2>Demandes de collaboration</h2>
            <p>Gérez vos demandes de collaboration</p>
          </div>
        </div>
        <button onClick={() => setShowNewRequest(true)} className="new-request-button">
          <Send />
          Nouvelle demande
        </button>
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab('received')} className={`tab ${activeTab === 'received' ? 'active' : ''}`}>
          Reçues ({requests.filter(r => r.type === 'received').length})
        </button>
        <button onClick={() => setActiveTab('sent')} className={`tab ${activeTab === 'sent' ? 'active' : ''}`}>
          Envoyées ({requests.filter(r => r.type === 'sent').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <MessageSquare className="icon" />
          <h4>Aucune demande {activeTab === 'received' ? 'reçue' : 'envoyée'}</h4>
          <p>{activeTab === 'received' ? 'Vous n’avez pas encore reçu de demandes.' : 'Vous n’avez pas encore envoyé de demandes.'}</p>
        </div>
      ) : (
        <div className="request-list">
        {filtered.map((req) => {
          const isBrand = req.fromUser.type === 'brand';
          const imageSrc = isBrand
            ? req.fromUser.logo?.startsWith('/uploads') ? req.fromUser.logo : `/uploads/logo/${req.fromUser.logo}`
            : req.fromUser.image?.startsWith('/uploads') ? req.fromUser.image : `/uploads/avatar/${req.fromUser.image}`;


          
          
      
          return (
            <div key={req.id} className="request-card">
              <div className="request-user">
                <img
                    src={imageSrc}
                    alt={req.fromUser.name}
                    className="profile-avatar"
                  />




                <div>
                  <strong>{req.fromUser.name}</strong>
                  
                </div>
                <span className={`status ${req.status}`}>{req.status}</span>
              </div>
      
              <div className="request-campaign">
                <h5>{req.campaign.title}</h5>
                <p>{req.campaign.description}</p>
                <p><strong>Budget :</strong> {req.campaign.budget} €</p>
                <p><strong>Date limite :</strong> {req.campaign.deadline}</p>
                <p><strong>Livrables :</strong> {Array.isArray(req.campaign.deliverables) ? req.campaign.deliverables.join(', ') : req.campaign.deliverables}</p>
              </div>

      
              <div className="request-msg">"{req.message}"</div>
      
              {req.reply && (
                <div className="reply-message">
                  <strong>Réponse :</strong> {req.reply}
                </div>
              )}
      
              {req.status === 'accepted' && (
                <div className="continue-chat-wrapper">
                  <button
                    className="btn continue-chat"
                    onClick={() => navigate(`/conversation/${req.fromUser.id}`)}
                  >
                    💬 Continuer la conversation
                  </button>
                </div>
              )}
      
              {req.status === 'pending' && activeTab === 'received' && (
                <div className="request-actions">
                  <button onClick={() => handleReject(req.id)} className="btn reject">
                    <X size={16} /> Refuser
                  </button>
                  <button onClick={() => handleAccept(req.id)} className="btn accept">
                    <CheckCircle size={16} /> Accepter
                  </button>
                </div>
              )}
      
              {req.status === 'pending' && activeTab === 'sent' && (
                <div className="waiting-message">
                  <Clock size={16} /> En attente de réponse
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      )}
    </div>
  );
};

const ReplyModal = ({ onClose, onSubmit }) => {
  const [message, setMessage] = useState('');

  const suggestions = [
    "Merci pour votre proposition, je suis partant !",
    "Je suis ravi d'accepter cette collaboration.",
    "C’est un plaisir de travailler avec vous !"
  ];

  const handleSuggestionClick = (text) => {
    setMessage(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Le message est obligatoire.");
      return;
    }
    onSubmit(message.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box1">
        <div className="modal-header">
          <h3>Répondre à la demande</h3>
          <button onClick={onClose} className="modal-close">
            <XCircle />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <p>Rédigez un message de confirmation pour cette collaboration :</p>
          <textarea
            placeholder="Votre message..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <button type="button" key={i} onClick={() => handleSuggestionClick(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel">Annuler</button>
            <button type="submit" className="submit">
              <CheckCircle /> Accepter et envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NewRequestForm = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    recipientName: '',
    campaignTitle: '',
    description: '',
    budget: '',
    deadline: '',
    deliverables: '',
    message: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      recipientName: form.recipientName,
      title: form.campaignTitle,
      description: form.description,
      budget: Number(form.budget),
      deadline: form.deadline,
      deliverables: form.deliverables.split(','),
      message: form.message
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box1">
        <div className="modal-header">
          <h3>Nouvelle demande</h3>
          <button onClick={onClose} className="modal-close">
            <XCircle />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Destinataire *</label>
            <input
              type="text"
              placeholder="Nom de la marque ou de l'influenceur"
              required
              value={form.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Titre de la campagne *</label>
            <input
              type="text"
              placeholder="Ex: Collaboration Beauté Printemps 2024"
              required
              value={form.campaignTitle}
              onChange={(e) => handleChange('campaignTitle', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Décrivez votre proposition de collaboration..."
              required
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Budget proposé (€) *</label>
              <input
                type="number"
                placeholder="Ex: 500"
                required
                value={form.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date limite *</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Livrables attendus *</label>
            <input
              type="text"
              placeholder="Ex: 2 posts Instagram, 3 stories, 1 reel"
              required
              value={form.deliverables}
              onChange={(e) => handleChange('deliverables', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Message personnel *</label>
            <textarea
              placeholder="Ajoutez un message personnel..."
              required
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel">Annuler</button>
            <button type="submit" className="submit">
              <Send /> Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborationRequests;
