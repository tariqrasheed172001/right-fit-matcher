const sequelize = require("../config/sequelize");
const University = require("./University");
const User = require("./User");
const Search = require("./Search");

// Initialize models
const models = {
  University: University(sequelize),
  User: User(sequelize),
  Search: Search(sequelize),
};

// Define associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize,
};
