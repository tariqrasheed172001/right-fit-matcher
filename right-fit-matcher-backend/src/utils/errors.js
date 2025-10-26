class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
};
