const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Activité 1' }, { id: 2, name: 'Activité 2' }]);
});

module.exports = router;
