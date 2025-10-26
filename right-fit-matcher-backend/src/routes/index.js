const express = require("express");
const universityRoutes = require("./universityRoutes");
const userRoutes = require("./userRoutes");
const matchRoutes = require("./matchRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

// Mount route modules
router.use("/universities", universityRoutes);
router.use("/users", userRoutes);
router.use("/match", matchRoutes);
router.use("/auth", authRoutes);

module.exports = router;
