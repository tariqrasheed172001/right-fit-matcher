const UserRepository = require("../repositories/UserRepository");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // ----- user business logic -----
  async getUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(data) {
    this.validateUserData(data);
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
    }
    return await this.userRepository.create(data);
  }

  async updateUser(id, data) {
    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserSearchHistory(userId, limit = 10) {
    const user = await this.getUserById(userId);
    return await this.userRepository.getSearchHistory(userId, limit);
  }

  // ----- helper -----
  validateUserData(data) {
    const errors = [];
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }
    if (data.gmat && (data.gmat < 0 || data.gmat > 800)) {
      errors.push("GMAT score must be between 0 and 800");
    }
    if (data.gpa && (data.gpa < 0 || data.gpa > 4)) {
      errors.push("GPA must be between 0 and 4");
    }
    if (
      data.target_program &&
      !["MBA", "MS", "MSCS", "MSDS", "PhD"].includes(data.target_program)
    ) {
      errors.push("Invalid target program");
    }
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }
}

module.exports = UserService;
