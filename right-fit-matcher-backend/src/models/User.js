const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
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
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      gmat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 800,
        },
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 4,
        },
      },
      work_exp: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
      },
      target_program: {
        type: DataTypes.ENUM("MBA", "MS", "MSCS", "MSDS", "PhD"),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    // User has many Searches
    User.hasMany(models.Search, {
      foreignKey: "user_id",
      as: "searches",
    });
  };

  return User;
};
