require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { sequelize } = require("./models");
const apiRoutes = require("./routes");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Request logging middleware
app.use(requestLogger);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
sequelize
  .sync({ alter: false })
  .then(() => {
    logger.success("Database synchronized successfully");
  })
  .catch((err) => {
    logger.error("Database synchronization error:", err);
  });

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Right Fit Matcher API Documentation",
  })
);

// Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  logger.success(`Server is running on port ${port}`);
  logger.info(`Health check: http://localhost:${port}/health`);
  logger.info(`API base: http://localhost:${port}/api`);
  logger.info(`API Documentation: http://localhost:${port}/api-docs`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
