const AuthService = require("../../services/AuthService");
const UserRepository = require("../../repositories/UserRepository");
const bcrypt = require("bcryptjs");

jest.mock("../../repositories/UserRepository");
jest.mock("bcryptjs");

describe("AuthService", () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    UserRepository.mockImplementation(() => mockUserRepository);
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    const validUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      gmat: 700,
      gpa: 3.5,
    };

    it("should successfully register a new user", async () => {
      const hashedPassword = "hashedPassword123";
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 1,
        ...validUserData,
        password: hashedPassword,
        toJSON: jest.fn(() => ({ id: 1, ...validUserData })),
      });
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await authService.register(
        validUserData.name,
        validUserData.email,
        validUserData.password,
        { gmat: validUserData.gmat, gpa: validUserData.gpa }
      );

      expect(result.user.email).toBe(validUserData.email);
      expect(result.token).toBeDefined();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserData.email
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it("should throw error if email is invalid", async () => {
      await expect(
        authService.register("Test User", "invalid-email", "password123")
      ).rejects.toThrow("Invalid email format");
    });

    it("should throw error if user already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });

      await expect(
        authService.register(
          validUserData.name,
          validUserData.email,
          validUserData.password
        )
      ).rejects.toThrow("User with this email already exists");
    });

    it("should throw error if password is too short", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.register("Test User", "test@example.com", "12345")
      ).rejects.toThrow("Password must be at least 6 characters long");
    });

    it("should throw error if password contains only spaces", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.register("Test User", "test@example.com", "      ")
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    const validEmail = "test@example.com";
    const validPassword = "password123";

    it("should successfully login with valid credentials", async () => {
      const mockUser = {
        id: 1,
        email: validEmail,
        password: "hashedPassword",
        name: "Test User",
        toJSON: jest.fn(() => ({
          id: 1,
          email: validEmail,
          name: "Test User",
        })),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.login(validEmail, validPassword);

      expect(result.user.email).toBe(validEmail);
      expect(result.token).toBeDefined();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validPassword,
        mockUser.password
      );
    });

    it("should throw error if email is invalid", async () => {
      await expect(
        authService.login("invalid-email", "password")
      ).rejects.toThrow("Invalid email format");
    });

    it("should throw error if user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error if password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: validEmail,
        password: "hashedPassword",
        toJSON: jest.fn(() => ({ id: 1, email: validEmail })),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login(validEmail, "wrongpassword")
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("getProfile", () => {
    it("should return user profile without password", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        gmat: 700,
        password: "hashed",
        toJSON: jest.fn(() => ({
          id: 1,
          name: "Test User",
          email: "test@example.com",
          gmat: 700,
        })),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.getProfile(1);

      expect(result.password).toBeUndefined();
      expect(result.id).toBe(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw error if user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.getProfile(999)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update user profile excluding password", async () => {
      const updateData = { gmat: 750, gpa: 3.8 };
      const mockUpdatedUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        gmat: 750,
        gpa: 3.8,
        toJSON: jest.fn(() => ({
          id: 1,
          name: "Test User",
          email: "test@example.com",
          gmat: 750,
          gpa: 3.8,
        })),
      };

      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await authService.updateProfile(1, updateData);

      expect(result.gmat).toBe(750);
      expect(result.gpa).toBe(3.8);
      expect(result.password).toBeUndefined();
    });

    it("should throw error if user not found", async () => {
      mockUserRepository.update.mockResolvedValue(null);

      await expect(
        authService.updateProfile(999, { gmat: 750 })
      ).rejects.toThrow("User not found");
    });

    it("should not allow password updates through this method", async () => {
      const updateData = { password: "newpassword" };
      const mockUpdatedUser = {
        id: 1,
        toJSON: jest.fn(() => ({ id: 1, password: undefined })),
      };

      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      await authService.updateProfile(1, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {});
    });
  });
});
