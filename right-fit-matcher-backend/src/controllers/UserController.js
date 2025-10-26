const UserService = require("../services/UserService");
const MatchingService = require("../services/MatchingService");
const SearchRepository = require("../repositories/SearchRepository");
const logger = require("../utils/logger");

class UserController {
  constructor() {
    this.userService = new UserService();
    this.matchingService = new MatchingService();
    this.searchRepository = new SearchRepository();
  }

  // --------- Request Handlers ---------

  async createUser(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      this.logSuccess("User created", user.id);
      res.status(201).json({ user_id: user.id, ...user.dataValues });
    } catch (error) {
      this.logError("Create user", error, req.body.email);
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.userService.getUsers();
      this.logSuccess("Users retrieved", null, users.length);
      res.json({ users });
    } catch (error) {
      this.logError("Get users", error);
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);

      if (!user) {
        this.logNotFound("User", req.params.id);
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      this.logError("Get user", error, req.params.id);
      next(error);
    }
  }

  async getUserSearches(req, res, next) {
    try {
      const { id } = req.params;
      const { limit } = req.query;

      const searches = await this.searchRepository.findByUserId(
        id,
        limit ? parseInt(limit) : undefined
      );

      this.logSuccess("User searches retrieved", id, searches.length);
      res.json({ searches });
    } catch (error) {
      this.logError("Get user searches", error, req.params.id);
      next(error);
    }
  }

  async findMatches(req, res, next) {
    try {
      const matches = await this.matchingService.findMatches(req.body);

      if (req.body.user_id) {
        await this.saveSearchHistory(req.body.user_id, req.body, matches);
      }

      this.logSuccess("Matches found", null, matches.length);
      res.json({ matches });
    } catch (error) {
      this.logError("Find matches", error);
      next(error);
    }
  }

  // --------- Helpers ---------

  async saveSearchHistory(userId, query, results) {
    await this.searchRepository.create({
      user_id: userId,
      query,
      results,
    });
    logger.info("Search saved to history", {
      userId,
      matchCount: results.length,
    });
  }

  logSuccess(action, userId, count = null) {
    const context = userId ? { userId } : {};
    if (count !== null) context.count = count;
    logger.info(`${action} successful`, context);
  }

  logError(action, error, context = null) {
    const logContext = context ? { userId: context } : {};
    logger.error(`${action} error`, { error: error.message, ...logContext });
  }

  logNotFound(resource, id) {
    logger.warn(`${resource} not found`, { [resource.toLowerCase()]: id });
  }
}

module.exports = UserController;
