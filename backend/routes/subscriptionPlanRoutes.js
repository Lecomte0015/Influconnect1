const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlanController');


router.get('/', subscriptionPlanController.getAllSubscriptionPlans);

module.exports = router;
