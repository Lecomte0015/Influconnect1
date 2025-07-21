const express = require('express');
const router = express.Router();

const stripeController = require('../controllers/stripeController');

const { handleStripeWebhook } = require('../utils/webhookHandler');

const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/create-checkout-session', stripeController.handleCreateCheckoutSession);

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


router.get('/customer-portal', authenticateToken, stripeController.redirectToCustomerPortal);

router.post('/track-subscription', stripeController.handleTrackSubscription);

module.exports = router;
