/**
 * Global Error Handling Middleware
 * Ensures all errors are returned in a consistent JSON format.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
