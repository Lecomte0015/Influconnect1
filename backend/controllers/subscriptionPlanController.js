const db = require('../db');

// Fonction pour récupérer tous les plans d’abonnement
exports.getAllSubscriptionPlans = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM subscription_plans');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des plans :', error);
    res.status(500).json({ error: 'Erreur serveur. Impossible de récupérer les plans.' });
  }
};

