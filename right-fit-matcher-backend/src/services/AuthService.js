const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} = require("../utils/errors");

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // --------- Helpers ---------

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateToken(userId) {
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  removePassword(user) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password) {
    return password.length >= 6;
  }

  // --------- Business Logic ---------

  async register(name, email, password, profileData = {}) {
    if (!this.isValidEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
    }

    if (!this.isValidPassword(password)) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    const hashedPassword = await this.hashPassword(password);
    const userData = { name, email, password: hashedPassword, ...profileData };
    const user = await this.userRepository.create(userData);

    return {
      user: this.removePassword(user),
      token: this.generateToken(user.id),
    };
  }

  async login(email, password) {
    if (!this.isValidEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    return {
      user: this.removePassword(user),
      token: this.generateToken(user.id),
    };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.removePassword(user);
  }

  async updateProfile(userId, updateData) {
    const { password, ...safeUpdateData } = updateData;
    const updatedUser = await this.userRepository.update(
      userId,
      safeUpdateData
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return this.removePassword(updatedUser);
  }
}

module.exports = AuthService;
