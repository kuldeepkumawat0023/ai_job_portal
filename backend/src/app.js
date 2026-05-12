const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// CORS config
const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
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
