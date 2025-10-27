require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
const requiresSSL =
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes("render.com") ||
    process.env.DATABASE_URL.includes("supabase.co"));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  ...(requiresSSL && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
});

module.exports = sequelize;
