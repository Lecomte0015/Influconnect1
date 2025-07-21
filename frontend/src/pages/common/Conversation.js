import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getCurrentUser } from '../../utils/context/Auth';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Trash2,
  Building2
} from 'lucide-react';

const Conversation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/conversations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Erreur chargement messages :', err.message);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn(`Utilisateur ${userId} introuvable.`);
          setUserInfo(null);
        } else {
          console.error('Erreur chargement utilisateur :', err.message);
        }
      }
    };

    fetchMessages();
    fetchUserInfo();
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('receiver_id', userId);
        formData.append('service_id', 1);

        const res = await api.post('/api/conversations/files', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          

        const fileUrl = res.data.url;

        const newFileMessage = {
          id: Date.now(),
          sender_id: currentUser.id,
          receiver_id: Number(userId),
          content: `📎 ${file.name}`,
          file_url: fileUrl,
          type: 'file',
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, newFileMessage]);
        URL.revokeObjectURL(file);
        setFile(null);
      } catch (err) {
        console.error('Erreur envoi fichier :', err.message);
      }
    }

    if (newMessage.trim()) {
      try {
        const res = await api.post('/api/conversations', {
          receiver_id: Number(userId),
          content: newMessage.trim()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const newMsg = {
          id: Date.now(),
          sender_id: currentUser.id,
          receiver_id: Number(userId),
          content: newMessage.trim(),
          type: 'chat',
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      } catch (err) {
        console.error('Erreur envoi message :', err.message);
      }
    }
  };

  const handleDeleteConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/conversations/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/collaborations');
    } catch (err) {
      console.error('Erreur suppression conversation :', err.message);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="conversation-wrapper">
      <div className="conversation-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft />
        </button>
        {userInfo && (
          <div className="user-info">
            <img
              src={
                userInfo.role === 'brand'
                  ? userInfo.logo || '/placeholder/logo.png'
                  : userInfo.image || '/placeholder/avatar.png'
              }
              alt="avatar"
            />
            <div>
              <h3>
                {userInfo.firstname} {userInfo.lastname}
                {userInfo.role === 'brand' && <Building2 size={14} />}
              </h3>
              <p>{userInfo.role === 'brand' ? userInfo.industry : `@${userInfo.username}`}</p>
            </div>
          </div>
        )}
        <div className="header-actions1">
          <button onClick={handleDeleteConversation}><Trash2 /></button>
        </div>
      </div>
  
      <div className="conversation-body">
        {messages.map((msg) => {
          const isSent = msg.sender_id === currentUser.id;
          const fileUrl = msg.file_url || msg.fileUrl;
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileUrl || '');
  
          return (
            <div key={msg.id} className={`message-row ${isSent ? 'sent' : 'received'}`}>
              <div className="message-bubble">
                {msg.type === 'file' && fileUrl ? (
                  <div
                    className="file-wrapper"
                    onMouseEnter={() => setHoveredFile(msg.id)}
                    onMouseLeave={() => setHoveredFile(null)}
                  >
                    {isImage ? (
                      <>
                        <img
                          src={fileUrl}
                          alt={msg.content}
                          className="preview-image"
                          onClick={() => setModalImage(fileUrl)}
                        />
                        {hoveredFile === msg.id && (
                         <a
                         href={encodeURI(fileUrl)}
                         download
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                         ⬇️ Télécharger
                       </a>
                       
                        )}
                      </>
                    ) : (
                      <>
                        <div className="file-preview-pdf">📄 {msg.content}</div>
                        {hoveredFile === msg.id && (
                          <a
                            href={fileUrl}
                            download
                            className="download-icon"
                            title="Télécharger le fichier"
                          >
                            ⬇️
                          </a>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="message-text">{msg.content}</div>
                )}
                <div className="message-date">{formatTime(msg.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>
  
      <form onSubmit={handleSendMessage} className="conversation-input">
        {file && (
          <div className="file-preview">
            {file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="preview-image"
              />
            ) : (
              <div className="preview-file">📎 {file.name}</div>
            )}
          </div>
        )}
        <label className="file-upload">
          <Paperclip />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
        />
        <button type="submit" disabled={!newMessage.trim() && !file}>
          <Send />
        </button>
      </form>
  
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <div className="modal-content" onClick={(e) => setModalImage(null)}>
            <img src={modalImage} alt="Aperçu complet" />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Conversation;
