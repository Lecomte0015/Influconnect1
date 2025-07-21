const express = require('express');
const router = express.Router();
const { getLatestPaymentMethod } = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

//  Protège la route avec le middleware
router.get('/latest', authenticateToken, getLatestPaymentMethod);

module.exports = router;
