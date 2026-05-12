const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// 1. Trust Proxy (Important for Rate Limiting behind Load Balancers like Heroku/Vercel/Nginx)
app.set('trust proxy', 1);

// 2. Performance Middleware
app.use(compression()); // Gzip compression for faster responses

// 3. Rate Limiting (Traffic Control)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply limiter to all API routes
app.use('/api', limiter);

// 4. Security Middleware
app.use(helmet());

// CORS config
const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, 'http://localhost:3000'], // Added localhost for testing
  credentials: true,
};
app.use(cors(corsOptions));

// Parsing Middleware (Stripe Webhook MUST come before express.json for raw body access)
app.post('/api/v1/payment/webhook', express.raw({ type: 'application/json' }), require('./controllers/paymentController').stripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const apiRoutes = require('./routes/index');

// Mount routes
app.use('/api/v1', apiRoutes);

// Global Error Handler (strictly uses 400 for errors)
app.use(errorHandler);

module.exports = app;
