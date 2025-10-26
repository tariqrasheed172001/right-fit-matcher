const { University } = require("../models");

class UniversityRepository {
  get baseAttributes() {
    return [
      "id",
      "name",
      "country",
      "program_type",
      "avg_gmat",
      "avg_gpa",
      "avg_work_exp",
      "admit_rate",
    ];
  }

  async findAll() {
    return await University.findAll({
      attributes: this.baseAttributes,
    });
  }

  async findByProgramType(programType) {
    return await University.findAll({
      where: { program_type: programType },
      attributes: this.baseAttributes,
    });
  }

  async findById(id) {
    return await University.findByPk(id, {
      attributes: this.baseAttributes,
    });
  }

  async create(data) {
    return await University.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await University.update(data, { where: { id } });
    if (affectedRows === 0) return null;
    return await this.findById(id);
  }

  async delete(id) {
    return await University.destroy({ where: { id } });
  }

  async getStatistics() {
    const { sequelize } = require("../models");
    const [results] = await sequelize.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT program_type) as program_types,
        COUNT(DISTINCT country) as countries,
        AVG(avg_gmat) as avg_gmat_score,
        AVG(avg_gpa) as avg_gpa_score,
        AVG(avg_work_exp) as avg_work_exp_years,
        AVG(admit_rate) as avg_admit_rate
      FROM universities
    `);
    return results[0];
  }
}

module.exports = UniversityRepository;
