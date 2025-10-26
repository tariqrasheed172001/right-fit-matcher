const AuthService = require("../services/AuthService");
const logger = require("../utils/logger");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // --------- Request Handlers ---------

  async register(req, res, next) {
    try {
      const { name, email, password, gmat, gpa, work_exp, target_program } = req.body;
      
      this.validateRequiredFields({ name, email, password });
      const profileData = this.buildProfileData({ gmat, gpa, work_exp, target_program });
      
      const result = await this.authService.register(name, email, password, profileData);
      
      this.logSuccess("Registration", result.user.id, email);
      res.status(201).json({
        message: "User registered successfully",
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      this.logError("Registration", error, req.body.email);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      this.validateRequiredFields({ email, password });
      const result = await this.authService.login(email, password);
      
      this.logSuccess("Login", result.user.id, email);
      res.json({ message: "Login successful", user: result.user, token: result.token });
    } catch (error) {
      this.logError("Login", error, req.body.email);
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.authService.getProfile(req.user.id);
      this.logSuccess("Get profile", req.user.id);
      res.json({ user });
    } catch (error) {
      this.logError("Get profile", error, req.user.id);
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await this.authService.updateProfile(req.user.id, req.body);
      
      this.logSuccess("Update profile", user.id);
      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      this.logError("Update profile", error, req.user.id);
      next(error);
    }
  }

  // --------- Helpers ---------

  validateRequiredFields(fields) {
    const missing = Object.entries(fields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }
  }

  buildProfileData({ gmat, gpa, work_exp, target_program }) {
    const profileData = {};
    if (gmat !== undefined) profileData.gmat = gmat;
    if (gpa !== undefined) profileData.gpa = gpa;
    if (work_exp !== undefined) profileData.work_exp = work_exp;
    if (target_program) profileData.target_program = target_program;
    return profileData;
  }

  logSuccess(action, userId, email = null) {
    const context = { userId };
    if (email) context.email = email;
    logger.info(`${action} successful`, context);
  }

  logError(action, error, context) {
    const logContext = typeof context === "object" ? context : { userId: context };
    logger.error(`${action} error`, { error: error.message, ...logContext });
  }
}

module.exports = AuthController;
