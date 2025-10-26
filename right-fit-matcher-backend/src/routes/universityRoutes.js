const express = require("express");
const UniversityController = require("../controllers/UniversityController");

const router = express.Router();
const universityController = new UniversityController();

router.get("/", (req, res, next) =>
  universityController.getUniversities(req, res, next)
);
router.get("/stats", (req, res, next) =>
  universityController.getStatistics(req, res, next)
);
router.get("/:id", (req, res, next) =>
  universityController.getUniversityById(req, res, next)
);
router.post("/", (req, res, next) =>
  universityController.createUniversity(req, res, next)
);

module.exports = router;
