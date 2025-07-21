const db = require('../db');

exports.getLatestPaymentMethod = async (req, res) => {
  console.log("[getLatestPaymentMethod] Requête reçue pour user :", req.user?.id);

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

  try {
    const [rows] = await db.promise().execute(`
      SELECT 
        card_brand, last4, exp_month, exp_year 
      FROM payments 
      WHERE user_id = ? 
        AND card_brand IS NOT NULL 
        AND status = 'completed'
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userId]);

    if (!rows.length) {
      console.log("[getLatestPaymentMethod] Aucun moyen de paiement trouvé pour user :", userId);
      return res.status(404).json({ message: "Aucun moyen de paiement trouvé" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("[getLatestPaymentMethod] Erreur SQL :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
