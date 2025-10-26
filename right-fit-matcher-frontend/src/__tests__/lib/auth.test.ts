import { authApi } from "@/lib/auth";
import api from "@/lib/api";

jest.mock("@/lib/api");

describe("authApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        message: "User registered successfully",
        user: { id: 1, ...userData },
        token: "mock-token",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authApi.register(userData);

      expect(api.post).toHaveBeenCalledWith("/api/auth/register", userData);
      expect(result.data).toEqual(mockResponse);
    });

    it("should include profile data in registration", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        gmat: 700,
        gpa: 3.5,
        work_exp: 3,
        target_program: "MBA",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { user: {}, token: "token" },
      });

      await authApi.register(userData);

      expect(api.post).toHaveBeenCalledWith("/api/auth/register", userData);
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        message: "Login successful",
        user: { id: 1, email: loginData.email },
        token: "mock-token",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authApi.login(loginData.email, loginData.password);

      expect(api.post).toHaveBeenCalledWith("/api/auth/login", loginData);
      expect(result.data).toEqual(mockResponse);
    });

    it("should handle login errors", async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(
        new Error("Invalid credentials")
      );

      await expect(
        authApi.login("test@example.com", "wrong")
      ).rejects.toThrow();
    });
  });

  describe("getProfile", () => {
    it("should get user profile", async () => {
      const mockResponse = {
        user: { id: 1, name: "Test User", email: "test@example.com" },
      };

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authApi.getProfile();

      expect(api.get).toHaveBeenCalledWith("/api/auth/profile");
      expect(result).toEqual({ data: mockResponse });
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const updateData = { gmat: 750, gpa: 3.8 };
      const mockResponse = {
        message: "Profile updated successfully",
        user: { id: 1, ...updateData },
      };

      (api.put as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authApi.updateProfile(updateData);

      expect(api.put).toHaveBeenCalledWith("/api/auth/profile", updateData);
      expect(result.data).toEqual(mockResponse);
    });
  });
});
