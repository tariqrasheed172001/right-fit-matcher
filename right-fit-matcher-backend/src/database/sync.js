require("dotenv").config();
const { sequelize } = require("../models");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    // Sync database schema
    await sequelize.sync({ force: false, alter: true });
    console.log("✅ Database schema synchronized successfully");

    await sequelize.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase;
