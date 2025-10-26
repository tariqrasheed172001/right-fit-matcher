const UniversityService = require("../services/UniversityService");
const logger = require("../utils/logger");

class UniversityController {
  constructor() {
    this.universityService = new UniversityService();
  }

  // --------- Request Handlers ---------

  async getUniversities(req, res, next) {
    try {
      const { program } = req.query;
      const universities = await this.universityService.getUniversities(
        program
      );

      this.logSuccess(
        "Universities retrieved",
        null,
        universities.length,
        program
      );
      res.json({ universities });
    } catch (error) {
      this.logError("Get universities", error, program);
      next(error);
    }
  }

  async getUniversityById(req, res, next) {
    try {
      const university = await this.universityService.getUniversityById(
        req.params.id
      );
      res.json({ university });
    } catch (error) {
      this.logError("Get university", error, req.params.id);
      next(error);
    }
  }

  async createUniversity(req, res, next) {
    try {
      const university = await this.universityService.createUniversity(
        req.body
      );

      this.logSuccess("University created", university.id);
      res.status(201).json({ university });
    } catch (error) {
      this.logError("Create university", error);
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const statistics = await this.universityService.getStatistics();
      this.logSuccess("Statistics retrieved");
      res.json({ statistics });
    } catch (error) {
      this.logError("Get statistics", error);
      next(error);
    }
  }

  // --------- Helpers ---------

  logSuccess(action, id = null, count = null, program = null) {
    const context = {};
    if (id) context.universityId = id;
    if (count !== null) context.count = count;
    if (program) context.program = program;
    logger.info(`${action} successful`, context);
  }

  logError(action, error, context = null) {
    const logContext = context
      ? typeof context === "string"
        ? { universityId: context }
        : { program: context }
      : {};
    logger.error(`${action} error`, { error: error.message, ...logContext });
  }
}

module.exports = UniversityController;
