const errorHandler = (err, req, res, next) => {
  // As per strict instructions, ALL errors return a 400 series Status Code.
  // No 500 or 300 series status codes are allowed.
  
  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 400; // Default to 400 if no status code is set

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 409; // Conflict
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400; // Bad Request
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    data: null
  });
};

module.exports = { errorHandler };
