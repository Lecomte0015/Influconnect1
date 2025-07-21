const express = require('express');
const router = express.Router();

const {
  getActiveSubscription,
  getNextPayment
} = require('../controllers/subscriptionController');

const { authenticateToken } = require('../middlewares/authMiddleware');

//  Routes protégées
router.get('/active', authenticateToken, getActiveSubscription);
router.get('/next-payment', authenticateToken, getNextPayment);


module.exports = router;
