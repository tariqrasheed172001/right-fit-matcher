const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Search = sequelize.define(
    "Search",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      query: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      results: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "searches",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Search.associate = (models) => {
    // Search belongs to User
    Search.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Search;
};
