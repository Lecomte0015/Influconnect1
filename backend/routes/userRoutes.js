const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/authMiddleware');

//  Recherche d'utilisateur par nom (marque ou influenceur)
router.get('/find-by-name', authenticateToken, (req, res) => {
    const name = req.query.name;
  
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Nom invalide ou manquant' });
    }
  
    const namePattern = `%${name.trim()}%`;

    const query = `
      SELECT id FROM users
      WHERE LOWER(business_name) LIKE LOWER(?) 
         OR LOWER(CONCAT(firstname, ' ', lastname)) LIKE LOWER(?)
    `;
    
  
    db.query(query, [namePattern, namePattern], (err, results) => {
      if (err) {
        console.error(' Erreur requête SQL :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
  
      res.json({ id: results[0].id });
    });
  });
  
  

module.exports = router;
