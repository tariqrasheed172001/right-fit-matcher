const {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} = require("../../utils/errors");

describe("Custom Error Classes", () => {
  describe("AppError", () => {
    it("should create AppError with default status code 500", () => {
      const error = new AppError("Something went wrong");
      expect(error.message).toBe("Something went wrong");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it("should create AppError with custom status code", () => {
      const error = new AppError("Bad Request", 400);
      expect(error.message).toBe("Bad Request");
      expect(error.statusCode).toBe(400);
    });

    it("should have proper stack trace", () => {
      const error = new AppError("Test error");
      expect(error.stack).toBeDefined();
    });
  });

  describe("ValidationError", () => {
    it("should create ValidationError with status code 400", () => {
      const error = new ValidationError("Invalid input");
      expect(error.message).toBe("Invalid input");
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("ValidationError");
    });
  });

  describe("NotFoundError", () => {
    it("should create NotFoundError with status code 404", () => {
      const error = new NotFoundError();
      expect(error.message).toBe("Resource not found");
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe("NotFoundError");
    });

    it("should accept custom message", () => {
      const error = new NotFoundError("User not found");
      expect(error.message).toBe("User not found");
    });
  });

  describe("AuthenticationError", () => {
    it("should create AuthenticationError with status code 401", () => {
      const error = new AuthenticationError();
      expect(error.message).toBe("Authentication failed");
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe("AuthenticationError");
    });

    it("should accept custom message", () => {
      const error = new AuthenticationError("Invalid credentials");
      expect(error.message).toBe("Invalid credentials");
    });
  });

  describe("AuthorizationError", () => {
    it("should create AuthorizationError with status code 403", () => {
      const error = new AuthorizationError();
      expect(error.message).toBe("Access denied");
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe("AuthorizationError");
    });
  });
});
