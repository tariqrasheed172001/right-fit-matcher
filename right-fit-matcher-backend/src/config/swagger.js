const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require("yamljs");
const path = require("path");
const fs = require("fs");

// Load and merge YAML documentation files
function loadYamlDocs() {
  const docsDir = path.join(__dirname, "../docs");
  const files = fs.readdirSync(docsDir);
  const paths = {};

  files.forEach((file) => {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      const filePath = path.join(docsDir, file);
      const yamlContent = YAML.load(filePath);
      if (yamlContent.paths) {
        Object.assign(paths, yamlContent.paths);
      }
    }
  });

  return paths;
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Right Fit Matcher API",
      version: "1.0.0",
      description:
        "A comprehensive API for matching users with the right university programs based on their profile (GMAT, GPA, work experience).",
      contact: {
        name: "API Support",
        email: "support@rightfitmatcher.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
      {
        url: "https://right-fit-matcher-oewp.onrender.com",
        description: "Production server",
      },
    ],
    paths: loadYamlDocs(),
    tags: [
      {
        name: "Universities",
        description: "University data operations",
      },
      {
        name: "Matching",
        description: "University matching algorithm",
      },
      {
        name: "Users",
        description: "User profile operations",
      },
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Health",
        description: "Health check endpoint",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/*.yaml"], // Required - point to YAML files
};

const swaggerSpec = swaggerJsdoc(options);

// Add schemas manually
swaggerSpec.components = {
  ...swaggerSpec.components,
  schemas: {
    University: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Stanford University" },
        country: { type: "string", example: "USA" },
        program_type: {
          type: "string",
          enum: ["MBA", "MS", "MSCS", "MSDS", "PhD"],
          example: "MBA",
        },
        avg_gmat: { type: "integer", example: 730 },
        avg_gpa: { type: "number", example: 3.8 },
        avg_work_exp: { type: "number", example: 4.5 },
        admit_rate: { type: "number", example: 0.08 },
      },
      required: ["name"],
    },
    User: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "John Doe" },
        email: { type: "string", format: "email", example: "john@example.com" },
        gmat: { type: "integer", example: 700 },
        gpa: { type: "number", example: 3.5 },
        work_exp: { type: "number", example: 3 },
        target_program: {
          type: "string",
          enum: ["MBA", "MS", "MSCS", "MSDS", "PhD"],
          example: "MBA",
        },
      },
    },
    MatchRequest: {
      type: "object",
      required: ["target_program"],
      properties: {
        gmat: {
          type: "integer",
          minimum: 0,
          maximum: 800,
          default: 0,
          example: 700,
        },
        gpa: {
          type: "number",
          minimum: 0,
          maximum: 4,
          default: 0,
          example: 3.5,
        },
        work_exp: { type: "number", default: 0, example: 3 },
        target_program: {
          type: "string",
          enum: ["MBA", "MS", "MSCS", "MSDS"],
          example: "MBA",
        },
        top_k: { type: "integer", default: 20, minimum: 1, example: 10 },
        user_id: { type: "integer", example: 1 },
      },
    },
    MatchResponse: {
      type: "object",
      properties: {
        matches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              university_id: { type: "integer", example: 1 },
              name: { type: "string", example: "Stanford University" },
              probability: { type: "number", example: 0.8524 },
              compatibility: { type: "number", example: 0.892 },
              details: {
                type: "object",
                properties: {
                  s_gmat: { type: "number", example: 0.962 },
                  s_gpa: { type: "number", example: 0.875 },
                  s_work: { type: "number", example: 0.833 },
                },
              },
            },
          },
        },
        count: { type: "integer", example: 10 },
      },
    },
    Search: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        user_id: { type: "integer", example: 1 },
        query: {
          type: "object",
          properties: {
            gmat: { type: "integer", example: 700 },
            gpa: { type: "number", example: 3.5 },
            work_exp: { type: "number", example: 3 },
            target_program: { type: "string", example: "MBA" },
          },
        },
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              university_id: { type: "integer", example: 1 },
              name: { type: "string", example: "Stanford University" },
              probability: { type: "number", example: 0.8524 },
              compatibility: { type: "number", example: 0.892 },
              details: {
                type: "object",
                properties: {
                  s_gmat: { type: "number", example: 0.962 },
                  s_gpa: { type: "number", example: 0.875 },
                  s_work: { type: "number", example: 0.833 },
                },
              },
            },
          },
        },
        created_at: {
          type: "string",
          format: "date-time",
          example: "2023-10-26T10:00:00Z",
        },
      },
    },
    Error: {
      type: "object",
      properties: {
        error: { type: "string", example: "University not found" },
      },
    },
  },
};

module.exports = swaggerSpec;
