const express = require('express');
const { createCheckoutSession, stripeWebhook, getMyPlan } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/checkout', protect, createCheckoutSession);     // Create Stripe session
router.get('/my-plan', protect, getMyPlan);                    // Get current plan & usage limits

// Webhook — Raw body required for Stripe signature verification
// NOTE: The main webhook endpoint is also registered in app.js for raw body handling
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
