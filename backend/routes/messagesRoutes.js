const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/authMiddleware');


router.post('/', authenticateToken, (req, res) => {
  const { sender_id, receiver_id, content, type } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const messageType = type || 'collaboration';

  const query = `
    INSERT INTO Messages (sender_id, receiver_id, content, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(query, [sender_id, receiver_id, content, messageType, false], (err, result) => {
    if (err) {
      console.error(' Erreur insertion message :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.status(201).json({
      message: 'Message enregistré avec succès',
      messageId: result.insertId,
      type: messageType
    });
  });
});



router.get('/', authenticateToken, (req, res) => {
  const { type, userId, from, to } = req.query;

  let query = '';
  let params = [];

  if (type === 'sent' && userId) {
    query = 'SELECT * FROM Messages WHERE sender_id = ? ORDER BY created_at DESC';
    params = [userId];

  } else if (type === 'received' && userId) {
    query = 'SELECT * FROM Messages WHERE receiver_id = ? ORDER BY created_at DESC';
    params = [userId];

  } else if (type === 'conversation' && from && to) {
    query = `
      SELECT * FROM Messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `;
    params = [from, to, to, from];

  } else {
    return res.status(400).json({ error: 'Paramètres de requête invalides' });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Erreur récupération messages :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.status(200).json({ messages: results });
  });
});

router.patch('/:id', authenticateToken, (req, res) => {
    const messageId = req.params.id;
    const { status } = req.body;
  
    const allowed = ['accepted', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
  
    const query = 'UPDATE Messages SET status = ? WHERE id = ?';
    db.query(query, [status, messageId], (err, result) => {
      if (err) {
        console.error(' Erreur SQL :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
  
      res.json({ success: true, message: 'Statut mis à jour' });
    });
  });
  
  

module.exports = router;
