const { User, Search } = require("../models");

class UserRepository {
  get baseAttributes() {
    return { exclude: ["created_at"] };
  }

  async findAll() {
    return await User.findAll({ attributes: this.baseAttributes });
  }

  async findById(id) {
    return await User.findByPk(id, { attributes: this.baseAttributes });
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: this.baseAttributes,
    });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await User.update(data, { where: { id } });
    if (affectedRows === 0) return null;
    return await this.findById(id);
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }

  async getSearchHistory(userId, limit = 10) {
    return await Search.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit,
    });
  }
}

module.exports = UserRepository;
