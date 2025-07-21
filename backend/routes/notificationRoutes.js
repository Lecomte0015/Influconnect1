const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.json([{ id: 1, message: 'Nouveau message' }, { id: 2, message: 'Paiement confirmé' }]);
});
module.exports = router;
