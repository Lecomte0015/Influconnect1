import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/context/Auth';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data.users || []);
      } catch (err) {
        console.error('Erreur chargement inbox :', err.message);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="inbox-wrapper">
      <h2>Messagerie</h2>
      <ul className="conversation-list">
        {conversations.map((user, i) => (
          <li key={i} className="conversation-item" onClick={() => navigate(`/conversation/${user.otherUserId}`)}>
            <div className="conversation-avatar">👤</div>
            <div className="conversation-info">
              <strong>Utilisateur #{user.otherUserId}</strong>
              <p>Dernier message...</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
