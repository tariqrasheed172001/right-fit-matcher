const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");
const { AuthenticationError } = require("../utils/errors");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.warn("Authentication failed: No token provided", {
        url: req.url,
        method: req.method,
      });
      throw new AuthenticationError("Access denied. No token provided.");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (jwtError) {
      logger.warn("Authentication failed: Invalid token", {
        error: jwtError.name,
        url: req.url,
      });
      throw new AuthenticationError(
        jwtError.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token"
      );
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      logger.warn("Authentication failed: User not found", {
        userId: decoded.userId,
      });
      throw new AuthenticationError("Invalid token. User not found.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    logger.debug("Authentication successful", { userId: user.id });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticateToken;
