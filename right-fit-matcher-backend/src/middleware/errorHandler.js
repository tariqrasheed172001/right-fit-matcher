const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : "anonymous",
  });

  const statusCode = err.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;
  const shouldShowMessage =
    isClientError || process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    error: shouldShowMessage ? err.message : "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
