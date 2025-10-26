const UniversityRepository = require("../repositories/UniversityRepository");

class MatchingService {
  constructor() {
    this.universityRepository = new UniversityRepository();
  }

  // --------- Helpers ---------
  clampValue(x, min = 0, max = 1) {
    return Math.max(min, Math.min(max, x));
  }

  normalizeGmat(gmat) {
    return Number(gmat) / 800;
  }

  normalizeGpa(gpa) {
    return Number(gpa) / 4;
  }

  calculateGmatScore(userGmat, universityAvgGmat) {
    if (!universityAvgGmat) return 1;
    const userNorm = this.normalizeGmat(userGmat);
    const uniNorm = this.normalizeGmat(universityAvgGmat);
    return this.clampValue(1 - (uniNorm - userNorm));
  }

  calculateGpaScore(userGpa, universityAvgGpa) {
    return this.clampValue(1 - (this.normalizeGpa(universityAvgGpa) - this.normalizeGpa(userGpa)));
  }

  calculateWorkExpScore(userWorkExp, universityAvgWorkExp) {
    if (!universityAvgWorkExp) return 1;
    return this.clampValue(1 - (universityAvgWorkExp - userWorkExp) / (universityAvgWorkExp + 1));
  }

  getScoreWeights(programType) {
    if (programType === "MBA") {
      return { gmat: 0.45, gpa: 0.3, work: 0.25 };
    } else {
      return { gmat: 0.0, gpa: 0.6, work: 0.4 };
    }
  }

  // --------- Business Logic ---------
  calculateMatchScore(user, university) {
    const admitRate = Number(university.admit_rate) || 0.1;
    const programType = university.program_type || "MBA";

    const s_gmat = this.calculateGmatScore(user.gmat, university.avg_gmat);
    const s_gpa = this.calculateGpaScore(user.gpa, university.avg_gpa);
    const s_work = this.calculateWorkExpScore(user.work_exp, university.avg_work_exp);

    const weights = this.getScoreWeights(programType);

    const compatibility =
      weights.gmat * s_gmat +
      weights.gpa * s_gpa +
      weights.work * s_work;

    const probabilityRaw = admitRate * (0.6 + 0.4 * compatibility);
    const probability = this.clampValue(probabilityRaw, 0.0001, 0.95);

    return {
      probability: Number(probability.toFixed(4)),
      compatibility: Number(compatibility.toFixed(3)),
      reasons: {
        s_gmat: Number(s_gmat.toFixed(3)),
        s_gpa: Number(s_gpa.toFixed(3)),
        s_work: Number(s_work.toFixed(3)),
      },
    };
  }

  async findMatches(userProfile) {
    const {
      gmat = 0,
      gpa = 0,
      work_exp = 0,
      target_program = "MBA",
      top_k = 20,
    } = userProfile;

    const universities = await this.universityRepository.findByProgramType(target_program);

    return universities
      .map((university) => {
        const score = this.calculateMatchScore(
          { gmat, gpa, work_exp, target_program },
          university
        );
        return {
          university_id: university.id,
          name: university.name,
          probability: score.probability,
          compatibility: score.compatibility,
          details: score.reasons,
        };
      })
      .sort((a, b) => b.probability - a.probability)
      .slice(0, top_k);
  }
}

module.exports = MatchingService;
