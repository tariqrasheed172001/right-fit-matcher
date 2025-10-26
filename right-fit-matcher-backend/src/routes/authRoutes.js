const express = require("express");
const AuthController = require("../controllers/AuthController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const authController = new AuthController();

// ----- public routes -----
router.post("/register", (req, res, next) =>
  authController.register(req, res, next)
);
router.post("/login", (req, res, next) => authController.login(req, res, next));

// ----- protected routes -----
router.get("/profile", authenticateToken, (req, res, next) =>
  authController.getProfile(req, res, next)
);
router.put("/profile", authenticateToken, (req, res, next) =>
  authController.updateProfile(req, res, next)
);

module.exports = router;
