const UniversityRepository = require("../repositories/UniversityRepository");
const { ValidationError, NotFoundError } = require("../utils/errors");

class UniversityService {
  constructor() {
    this.universityRepository = new UniversityRepository();
  }

  // --------- Business Logic ---------

  async getUniversities(programType = null) {
    if (programType) {
      return await this.universityRepository.findByProgramType(programType);
    }
    return await this.universityRepository.findAll();
  }

  async getUniversityById(id) {
    const university = await this.universityRepository.findById(id);
    if (!university) {
      throw new NotFoundError("University not found");
    }
    return university;
  }

  async createUniversity(data) {
    this.validateUniversityData(data);
    return await this.universityRepository.create(data);
  }

  async updateUniversity(id, data) {
    this.validateUniversityData(data);
    const university = await this.universityRepository.update(id, data);
    
    if (!university) {
      throw new NotFoundError("University not found");
    }
    
    return university;
  }

  async getStatistics() {
    return await this.universityRepository.getStatistics();
  }

  // --------- Validation ---------

  validateUniversityData(data) {
    const errors = [];

    if (data.name && data.name.length > 255) {
      errors.push("Name must be 255 characters or less");
    }

    if (
      data.program_type &&
      !["MBA", "MS", "MSCS", "MSDS", "PhD"].includes(data.program_type)
    ) {
      errors.push("Invalid program type");
    }

    if (data.avg_gmat && (data.avg_gmat < 0 || data.avg_gmat > 800)) {
      errors.push("GMAT score must be between 0 and 800");
    }

    if (data.avg_gpa && (data.avg_gpa < 0 || data.avg_gpa > 4)) {
      errors.push("GPA must be between 0 and 4");
    }

    if (data.admit_rate && (data.admit_rate < 0 || data.admit_rate > 1)) {
      errors.push("Admit rate must be between 0 and 1");
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
  }
}

module.exports = UniversityService;
