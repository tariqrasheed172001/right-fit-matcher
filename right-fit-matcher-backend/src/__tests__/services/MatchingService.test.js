const MatchingService = require("../../services/MatchingService");
const UniversityRepository = require("../../repositories/UniversityRepository");
const SearchRepository = require("../../repositories/SearchRepository");

jest.mock("../../repositories/UniversityRepository");
jest.mock("../../repositories/SearchRepository");

describe("MatchingService", () => {
  let matchingService;
  let mockUniversityRepository;
  let mockSearchRepository;

  const mockUniversities = [
    {
      id: 1,
      name: "Stanford University",
      country: "USA",
      program_type: "MBA",
      avg_gmat: 737,
      avg_gpa: 3.86,
      avg_work_exp: 5.0,
      admit_rate: 0.06,
    },
    {
      id: 2,
      name: "Harvard University",
      country: "USA",
      program_type: "MBA",
      avg_gmat: 730,
      avg_gpa: 3.82,
      avg_work_exp: 5.0,
      admit_rate: 0.09,
    },
    {
      id: 3,
      name: "UC Berkeley",
      country: "USA",
      program_type: "MBA",
      avg_gmat: 725,
      avg_gpa: 3.7,
      avg_work_exp: 4.5,
      admit_rate: 0.12,
    },
  ];

  beforeEach(() => {
    mockUniversityRepository = {
      findAll: jest.fn(),
      findByProgramType: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      getStatistics: jest.fn(),
    };

    mockSearchRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    };

    UniversityRepository.mockImplementation(() => mockUniversityRepository);
    SearchRepository.mockImplementation(() => mockSearchRepository);

    matchingService = new MatchingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findMatches", () => {
    it("should find matching universities for MBA program", async () => {
      const userData = {
        gmat: 730,
        gpa: 3.8,
        work_exp: 5,
        target_program: "MBA",
        top_k: 10,
      };

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        mockUniversities
      );
      mockSearchRepository.create.mockResolvedValue({ id: 1 });

      const result = await matchingService.findMatches({
        ...userData,
        user_id: 1,
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("university_id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("probability");
      expect(result[0]).toHaveProperty("compatibility");
      expect(mockUniversityRepository.findByProgramType).toHaveBeenCalledWith(
        "MBA"
      );
    });

    it("should return results sorted by probability in descending order", async () => {
      const userData = {
        gmat: 700,
        gpa: 3.5,
        work_exp: 4,
        target_program: "MBA",
        top_k: 3,
      };

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        mockUniversities
      );

      const result = await matchingService.findMatches(userData);

      expect(result.length).toBe(3);
      expect(result[0].probability).toBeGreaterThanOrEqual(
        result[1].probability
      );
      expect(result[1].probability).toBeGreaterThanOrEqual(
        result[2].probability
      );
    });

    it("should limit results to top_k", async () => {
      const userData = {
        gmat: 730,
        gpa: 3.8,
        work_exp: 5,
        target_program: "MBA",
        top_k: 2,
      };

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        mockUniversities
      );

      const result = await matchingService.findMatches(userData);

      expect(result.length).toBe(2);
    });

    it("should handle MS program (non-MBA) with GMAT weight set to 0", async () => {
      const msUniversity = [
        {
          id: 4,
          name: "MIT",
          program_type: "MS",
          avg_gmat: 0,
          avg_gpa: 3.7,
          avg_work_exp: 1,
          admit_rate: 0.15,
        },
      ];

      const userData = {
        gmat: 0,
        gpa: 3.6,
        work_exp: 1,
        target_program: "MS",
        top_k: 10,
      };

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        msUniversity
      );

      const result = await matchingService.findMatches(userData);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].probability).toBeDefined();
    });

    it("should not save search if user_id is not provided", async () => {
      const userData = {
        gmat: 730,
        gpa: 3.8,
        work_exp: 5,
        target_program: "MBA",
        top_k: 10,
      };

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        mockUniversities
      );

      await matchingService.findMatches(userData);

      expect(mockSearchRepository.create).not.toHaveBeenCalled();
    });

    it("should handle missing/adjusted parameters gracefully", async () => {
      const userData = {
        gmat: 0,
        gpa: 2.5,
        work_exp: 0,
        target_program: "MS",
        top_k: 10,
      };

      const msUniversity = [
        {
          id: 4,
          name: "MIT",
          program_type: "MS",
          avg_gmat: 0,
          avg_gpa: 3.7,
          avg_work_exp: 1,
          admit_rate: 0.15,
        },
      ];

      mockUniversityRepository.findByProgramType.mockResolvedValue(
        msUniversity
      );

      const result = await matchingService.findMatches(userData);

      expect(result).toBeDefined();
      expect(result[0].probability).toBeGreaterThan(0);
    });
  });

  describe("calculateMatchScore", () => {
    it("should calculate compatibility score correctly for MBA", () => {
      const user = { gmat: 730, gpa: 3.8, work_exp: 5 };
      const university = {
        program_type: "MBA",
        avg_gmat: 737,
        avg_gpa: 3.86,
        avg_work_exp: 5.0,
        admit_rate: 0.06,
      };

      const score = matchingService.calculateMatchScore(user, university);

      expect(score).toHaveProperty("probability");
      expect(score).toHaveProperty("compatibility");
      expect(score).toHaveProperty("reasons");
      expect(score.reasons).toHaveProperty("s_gmat");
      expect(score.reasons).toHaveProperty("s_gpa");
      expect(score.reasons).toHaveProperty("s_work");

      expect(score.probability).toBeGreaterThan(0);
      expect(score.probability).toBeLessThanOrEqual(1);
      expect(score.compatibility).toBeGreaterThanOrEqual(0);
      expect(score.compatibility).toBeLessThanOrEqual(1);
    });

    it("should give higher probability for users exceeding university averages", () => {
      const user = { gmat: 750, gpa: 4.0, work_exp: 6 };
      const university = {
        program_type: "MBA",
        avg_gmat: 730,
        avg_gpa: 3.8,
        avg_work_exp: 5.0,
        admit_rate: 0.1,
      };

      const score = matchingService.calculateMatchScore(user, university);

      expect(score.compatibility).toBeGreaterThan(0.8);
    });

    it("should give lower probability for users below university averages", () => {
      const user = { gmat: 650, gpa: 3.0, work_exp: 2 };
      const university = {
        program_type: "MBA",
        avg_gmat: 730,
        avg_gpa: 3.8,
        avg_work_exp: 5.0,
        admit_rate: 0.06,
      };

      const score = matchingService.calculateMatchScore(user, university);

      expect(score.probability).toBeLessThan(0.3);
    });
  });

  describe("clampValue", () => {
    it("should keep values within range", () => {
      expect(matchingService.clampValue(0.5, 0, 1)).toBe(0.5);
      expect(matchingService.clampValue(-1, 0, 1)).toBe(0);
      expect(matchingService.clampValue(2, 0, 1)).toBe(1);
    });

    it("should handle values outside range", () => {
      expect(matchingService.clampValue(5, 0, 1)).toBe(1);
      expect(matchingService.clampValue(-5, 0, 1)).toBe(0);
    });
  });
});
