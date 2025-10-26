const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();
const userController = new UserController();

router.post("/", (req, res, next) =>
  userController.findMatches(req, res, next)
);

module.exports = router;
