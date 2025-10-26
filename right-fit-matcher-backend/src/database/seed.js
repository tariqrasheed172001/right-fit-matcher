require("dotenv").config();
const { sequelize } = require("../models");
const { University } = require("../models");

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // Define universities data
    const universities = [
      {
        name: "Stanford Graduate School of Business",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 737,
        avg_gpa: 3.86,
        avg_work_exp: 5.0,
        admit_rate: 0.06,
      },
      {
        name: "Harvard Business School",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 730,
        avg_gpa: 3.82,
        avg_work_exp: 5.0,
        admit_rate: 0.09,
      },
      {
        name: "Wharton School (UPenn)",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 732,
        avg_gpa: 3.8,
        avg_work_exp: 5.0,
        admit_rate: 0.09,
      },
      {
        name: "MIT Sloan",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 727,
        avg_gpa: 3.75,
        avg_work_exp: 5.0,
        admit_rate: 0.11,
      },
      {
        name: "UC Berkeley Haas",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 725,
        avg_gpa: 3.7,
        avg_work_exp: 5.0,
        admit_rate: 0.12,
      },
      {
        name: "Columbia Business School",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 726,
        avg_gpa: 3.73,
        avg_work_exp: 5.0,
        admit_rate: 0.12,
      },
      {
        name: "Chicago Booth",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 730,
        avg_gpa: 3.75,
        avg_work_exp: 5.0,
        admit_rate: 0.12,
      },
      {
        name: "Kellogg (Northwestern)",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 727,
        avg_gpa: 3.7,
        avg_work_exp: 5.0,
        admit_rate: 0.13,
      },
      {
        name: "INSEAD",
        country: "France",
        program_type: "MBA",
        avg_gmat: 710,
        avg_gpa: 3.6,
        avg_work_exp: 4.0,
        admit_rate: 0.16,
      },
      {
        name: "London Business School",
        country: "UK",
        program_type: "MBA",
        avg_gmat: 705,
        avg_gpa: 3.58,
        avg_work_exp: 4.0,
        admit_rate: 0.18,
      },
      {
        name: "IESE Business School",
        country: "Spain",
        program_type: "MBA",
        avg_gmat: 700,
        avg_gpa: 3.5,
        avg_work_exp: 4.0,
        admit_rate: 0.2,
      },
      {
        name: "Carnegie Mellon Tepper",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 690,
        avg_gpa: 3.4,
        avg_work_exp: 4.0,
        admit_rate: 0.22,
      },
      {
        name: "NYU Stern",
        country: "USA",
        program_type: "MBA",
        avg_gmat: 700,
        avg_gpa: 3.5,
        avg_work_exp: 4.0,
        admit_rate: 0.22,
      },
      {
        name: "UC San Diego MS",
        country: "USA",
        program_type: "MS",
        avg_gmat: 0,
        avg_gpa: 3.6,
        avg_work_exp: 1.0,
        admit_rate: 0.3,
      },
      {
        name: "University of Illinois Urbana-Champaign MSCS",
        country: "USA",
        program_type: "MSCS",
        avg_gmat: 0,
        avg_gpa: 3.5,
        avg_work_exp: 0.5,
        admit_rate: 0.25,
      },
      {
        name: "CMU MSDS",
        country: "USA",
        program_type: "MSDS",
        avg_gmat: 0,
        avg_gpa: 3.6,
        avg_work_exp: 1.5,
        admit_rate: 0.2,
      },
      {
        name: "Imperial College London MS",
        country: "UK",
        program_type: "MS",
        avg_gmat: 0,
        avg_gpa: 3.4,
        avg_work_exp: 1.0,
        admit_rate: 0.28,
      },
      {
        name: "NUS Singapore MS",
        country: "Singapore",
        program_type: "MS",
        avg_gmat: 0,
        avg_gpa: 3.6,
        avg_work_exp: 1.0,
        admit_rate: 0.32,
      },
      {
        name: "IE Madrid MS",
        country: "Spain",
        program_type: "MS",
        avg_gmat: 0,
        avg_gpa: 3.3,
        avg_work_exp: 1.0,
        admit_rate: 0.35,
      },
      {
        name: "Tsinghua SEM",
        country: "China",
        program_type: "MBA",
        avg_gmat: 700,
        avg_gpa: 3.7,
        avg_work_exp: 4.0,
        admit_rate: 0.15,
      },
      {
        name: "Hong Kong UST",
        country: "HK",
        program_type: "MBA",
        avg_gmat: 690,
        avg_gpa: 3.6,
        avg_work_exp: 3.0,
        admit_rate: 0.2,
      },
    ];

    // Check if universities already exist
    const existingCount = await University.count();
    if (existingCount > 0) {
      console.log(
        `⚠️  ${existingCount} universities already exist in the database`
      );
      console.log("Skipping seed to avoid duplicates.");
      console.log("To re-seed the database, clear it first: npm run clear-db");
      await sequelize.close();
      process.exit(0);
    }

    // Insert universities
    await University.bulkCreate(universities);
    console.log(`✅ Successfully seeded ${universities.length} universities`);

    // Close connection
    await sequelize.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
