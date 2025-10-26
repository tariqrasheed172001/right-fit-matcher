const express = require("express");
const UserController = require("../controllers/UserController");
const auth = require("../middleware/auth");

const router = express.Router();
const userController = new UserController();

router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.get("/", auth, (req, res, next) =>
  userController.getUsers(req, res, next)
);
router.get("/:id/searches", auth, (req, res, next) =>
  userController.getUserSearches(req, res, next)
);
router.get("/:id", auth, (req, res, next) =>
  userController.getUserById(req, res, next)
);

module.exports = router;
