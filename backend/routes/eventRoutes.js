const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, title: 'Event A' }, { id: 2, title: 'Event B' }]);
});
module.exports = router;
