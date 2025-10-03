export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: true,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: true,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  res.status(500).json({
    error: true,
    message: 'Something went wrong!',
    code: 'INTERNAL_ERROR'
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found',
    code: 'NOT_FOUND'
  });
};
