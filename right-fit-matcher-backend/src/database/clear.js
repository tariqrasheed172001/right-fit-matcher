require("dotenv").config();
const { sequelize, University, User, Search } = require("../models");

async function clearDatabase() {
  try {
    console.log("🗑️  Clearing database...");

    await sequelize.authenticate();
    console.log("✅ Connected to database");

    await Search.destroy({ truncate: true });
    console.log("✅ Cleared searches table");

    await User.destroy({ truncate: true });
    console.log("✅ Cleared users table");

    await University.destroy({ truncate: true });
    console.log("✅ Cleared universities table");

    await sequelize.close();
    console.log("✅ Database cleared successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  clearDatabase();
}

module.exports = clearDatabase;
