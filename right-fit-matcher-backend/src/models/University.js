const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const University = sequelize.define(
    "University",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      program_type: {
        type: DataTypes.ENUM("MBA", "MS", "MSCS", "MSDS", "PhD"),
        allowNull: true,
      },
      avg_gmat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 800,
        },
      },
      avg_gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 4,
        },
      },
      avg_work_exp: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
      },
      admit_rate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
        validate: {
          min: 0,
          max: 1,
        },
      },
      score_scale: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "universities",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  University.associate = (models) => {};

  return University;
};
