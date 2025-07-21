const db = require('../db');

exports.getActiveSubscription = async (req, res) => {
  console.log("[getActiveSubscription] Requête reçue pour user :", req.user?.id);

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

  try {
    const [rows] = await db.promise().execute(`
      SELECT 
        s.id, 
        s.subscription_plan_id, 
        s.created_at AS start_date, 
        s.expire_at AS end_date, 
        s.status, 
        p.name, 
        p.price, 
        p.duration 
      FROM subscriptions s 
      JOIN subscription_plans p ON s.subscription_plan_id = p.id 
      WHERE s.user_id = ? AND s.status = 'active' 
      ORDER BY s.created_at DESC 
      LIMIT 1
    `, [userId]);

    if (!rows.length) {
      console.log("[getActiveSubscription] Aucun abonnement actif trouvé pour user :", userId);
      return res.status(404).json({ message: "Aucun abonnement actif" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("[getActiveSubscription] Erreur SQL :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.getNextPayment = async (req, res) => {
  console.log("[getNextPayment] Requête reçue pour user :", req.user?.id);

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

  try {
    const [rows] = await db.promise().execute(`
      SELECT amount, payment_date 
      FROM payments 
      WHERE user_id = ? AND status = 'pending'
      ORDER BY payment_date ASC 
      LIMIT 1
    `, [userId]);

    if (!rows.length) {
      console.log("[getNextPayment] Aucun paiement à venir pour user :", userId);
      return res.status(404).json({ message: "Aucun paiement prévu" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("[getNextPayment] Erreur SQL :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
