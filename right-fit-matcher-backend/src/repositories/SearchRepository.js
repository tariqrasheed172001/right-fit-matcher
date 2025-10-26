const { Search } = require("../models");

class SearchRepository {
  async findAll() {
    return await Search.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async findById(id) {
    return await Search.findByPk(id);
  }

  async create(data) {
    return await Search.create(data);
  }

  async findByUserId(userId, limit = 10) {
    return await Search.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit,
    });
  }

  async delete(id) {
    return await Search.destroy({ where: { id } });
  }
}

module.exports = SearchRepository;
