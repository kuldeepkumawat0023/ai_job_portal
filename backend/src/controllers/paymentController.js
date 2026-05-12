// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Temporarily disabled payment controller logic to prevent crash
exports.createCheckoutSession = async (req, res, next) => {
  res.status(503).json({ success: false, message: 'Payment system is temporarily disabled' });
};

exports.stripeWebhook = async (req, res, next) => {
  res.status(200).send('Webhook disabled');
};

exports.getMyPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('isPremium resumeRetries jobSearches');
    res.status(200).json({
      success: true,
      data: {
        plan: user.isPremium ? 'Premium-Lifetime' : 'Free',
        isPremium: user.isPremium,
        usage: {
          resumeAnalyses: user.resumeRetries,
          jobSearches: user.jobSearches
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Middleware to check usage limits (TEMPORARILY BYPASSED)
exports.checkUsageLimit = async (req, res, next) => {
  // Always allow for now while payment is hidden
  next();
  
  /* 
  Original Logic:
  const user = await User.findById(req.user.id);
  if (user.isPremium) return next();

  if (req.originalUrl.includes('resume') && user.resumeRetries >= 3) {
    return res.status(403).json({ success: false, message: 'Resume analysis limit reached' });
  }
  next();
  */
};
