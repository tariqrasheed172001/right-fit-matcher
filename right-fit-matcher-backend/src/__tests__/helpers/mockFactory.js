const { mock } = require("jest-mock-extended");

const createMockUser = (overrides = {}) => ({
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "$2b$10$hashedPassword",
  gmat: 700,
  gpa: 3.5,
  work_exp: 3,
  target_program: "MBA",
  toJSON: jest.fn(() => ({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    gmat: 700,
    gpa: 3.5,
    work_exp: 3,
    target_program: "MBA",
  })),
  ...overrides,
});

const createMockUniversity = (overrides = {}) => ({
  id: 1,
  name: "Test University",
  country: "USA",
  program_type: "MBA",
  avg_gmat: 730,
  avg_gpa: 3.8,
  avg_work_exp: 5,
  admit_rate: 0.1,
  toJSON: jest.fn(() => ({
    id: 1,
    name: "Test University",
    country: "USA",
    program_type: "MBA",
    avg_gmat: 730,
    avg_gpa: 3.8,
    avg_work_exp: 5,
    admit_rate: 0.1,
  })),
  ...overrides,
});

const createMockSearch = (overrides = {}) => ({
  id: 1,
  user_id: 1,
  query: { gmat: 700, gpa: 3.5, work_exp: 3, target_program: "MBA" },
  results: [{ university_id: 1, name: "Test University", probability: 0.85 }],
  created_at: new Date(),
  ...overrides,
});

module.exports = {
  createMockUser,
  createMockUniversity,
  createMockSearch,
};
