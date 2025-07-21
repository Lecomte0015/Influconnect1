const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddleware');

// 📦 Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(__dirname, '../public/conversations');
    fs.mkdirSync(folderPath, { recursive: true }); // crée le dossier si inexistant
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  }
});
const upload = multer({ storage });


// 📨 Liste des utilisateurs avec qui on a échangé
router.get('/conversations', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT DISTINCT
      CASE
        WHEN sender_id = ? THEN receiver_id
        ELSE sender_id
      END AS otherUserId
    FROM Messages
    WHERE sender_id = ? OR receiver_id = ?
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ users: results });
  });
});

// 🗂️ Historique complet entre deux utilisateurs
router.get('/conversations/:userId', authenticateToken, (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  const query = `
    SELECT * FROM Messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(query, [currentUserId, otherUserId, otherUserId, currentUserId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ messages: results });
  });
});

// 💬 Envoi d’un message texte
router.post('/conversations', authenticateToken, (req, res) => {
  const sender_id = req.user.id;
  const { receiver_id, content } = req.body;

  if (!receiver_id || !content) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const query = `
    INSERT INTO Messages (sender_id, receiver_id, content, type, status, is_read, created_at)
    VALUES (?, ?, ?, 'chat', NULL, false, NOW())
  `;

  db.query(query, [sender_id, receiver_id, content], (err, result) => {
    if (err) {
      console.error('❌ Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json({ success: true, messageId: result.insertId });
  });
});

// 🗑️ Suppression d’une conversation
router.delete('/conversations/:userId', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    await db.promise().execute(
      `DELETE FROM Messages
       WHERE sender_id = ? AND receiver_id = ?`,
      [currentUserId, otherUserId]
    );

    res.json({ success: true, message: 'Messages envoyés supprimés (côté utilisateur)' });
  } catch (err) {
    console.error('Erreur suppression conversation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📎 Nouvelle route : Upload de fichier conversationnel
router.post('/conversations/files', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });

  const fileUrl = `/conversations/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

module.exports = router;
