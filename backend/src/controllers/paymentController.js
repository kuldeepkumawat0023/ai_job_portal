const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

// =====================================
// FREE PLAN LIMITS (from Documentation)
// =====================================
const FREE_PLAN_LIMITS = {
  resumeRetries: 3,   // 3 AI resume analyses per month
  jobSearches: 5      // 5 job searches per month
};

// @desc    Check if user has exceeded free plan limits
// @usage   Called before any AI feature
exports.checkUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isPremium) {
      return next(); // Premium users have unlimited access
    }

    const featureType = req.query.feature || req.body.feature;

    if (featureType === 'resume' && user.resumeRetries >= FREE_PLAN_LIMITS.resumeRetries) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Free plan limit reached. You have used ${FREE_PLAN_LIMITS.resumeRetries} resume analyses this month. Upgrade to Premium for unlimited access.`,
        data: { upgradeRequired: true }
      });
    }

    if (featureType === 'search' && user.jobSearches >= FREE_PLAN_LIMITS.jobSearches) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Free plan limit reached. You have used ${FREE_PLAN_LIMITS.jobSearches} job searches this month. Upgrade to Premium for unlimited access.`,
        data: { upgradeRequired: true }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// @desc    Create Stripe Checkout Session (Premium Plan — $97 One-Time Lifetime)
// @route   POST /api/v1/payment/checkout
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isPremium) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'You are already a Premium member',
        data: null
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '💎 AI Job Portal — Premium (Lifetime)',
              description: 'Unlock unlimited AI resume analysis, job searches, mock interviews, coaching tips & daily job alerts. One-time payment, lifetime access.',
              images: []
            },
            unit_amount: 9700, // $97.00 (in cents) — as per documentation
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not recurring subscription
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        plan: 'Premium-Lifetime'
      }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Checkout session created',
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Stripe Webhook — Verify & Fulfill Purchase
// @route   POST /api/v1/payment/webhook
// @access  Public (Stripe calls this)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const paymentIntentId = session.payment_intent;
    const amountTotal = session.amount_total; // in cents

    try {
      // 1. Unlock Premium for the user
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        paymentId: paymentIntentId
      });

      // 2. Save Transaction record for admin revenue tracking
      await Transaction.create({
        userId,
        amount: amountTotal,      // stored in cents (9700 = $97.00)
        currency: session.currency,
        status: 'succeeded',
        paymentIntentId
      });

      // 3. Create/Update Subscription record
      await Subscription.findOneAndUpdate(
        { userId },
        {
          userId,
          plan: 'Premium-Lifetime',
          status: 'active',
          startDate: new Date(),
          expiryDate: null // Lifetime — no expiry
        },
        { upsert: true, new: true }
      );

      console.log(`✅ User ${userId} upgraded to Premium! Payment: $${(amountTotal / 100).toFixed(2)}`);
    } catch (err) {
      console.error('Webhook DB Update Error:', err.message);
    }
  }

  // Handle refund/charge failed events
  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    await Transaction.findOneAndUpdate(
      { paymentIntentId: charge.payment_intent },
      { status: 'failed' }
    ).catch(err => console.error('Refund update error:', err));
  }

  res.status(200).json({ received: true });
};

// @desc    Get current user's subscription/plan info
// @route   GET /api/v1/payment/my-plan
// @access  Private
exports.getMyPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('isPremium resumeRetries jobSearches');
    const subscription = await Subscription.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Plan details fetched',
      data: {
        isPremium: user.isPremium,
        plan: user.isPremium ? 'Premium-Lifetime' : 'Free',
        limits: user.isPremium ? {
          resumeRetries: 'Unlimited',
          jobSearches: 'Unlimited'
        } : {
          resumeRetries: `${user.resumeRetries || 0} / ${FREE_PLAN_LIMITS.resumeRetries} used`,
          jobSearches: `${user.jobSearches || 0} / ${FREE_PLAN_LIMITS.jobSearches} used`
        },
        subscription: subscription || null
      }
    });
  } catch (error) {
    next(error);
  }
};
