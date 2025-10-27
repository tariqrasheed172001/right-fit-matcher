const winston = require("winston");
const colors = require("colors");
const path = require("path");
const fs = require("fs");

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

colors.enable();

const levelColorize = winston.format.printf((info) => {
  const { level, message, timestamp } = info;

  let colorizedLevel = level.toUpperCase();
  let colorizedMessage = message;

  switch (level) {
    case "error":
      colorizedLevel = colors.bold.red(level.toUpperCase());
      colorizedMessage = colors.bold.red(message);
      break;
    case "warn":
      colorizedLevel = colors.bold.yellow(level.toUpperCase());
      colorizedMessage = colors.bold.yellow(message);
      break;
    case "info":
      colorizedLevel = colors.blue(level.toUpperCase());
      break;
    case "http":
      colorizedLevel = colors.cyan(level.toUpperCase());
      break;
    case "debug":
      colorizedLevel = colors.grey(level.toUpperCase());
      colorizedMessage = colors.grey(message);
      break;
    default:
      colorizedLevel = level.toUpperCase();
  }

  let output = `${colors.grey(
    timestamp
  )} ${colorizedLevel}: ${colorizedMessage}`;

  // Extract only custom metadata (exclude default fields)
  const metadata = info.metadata || {};
  const customMeta = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (
      key !== "service" &&
      key !== "timestamp" &&
      key !== "splat" &&
      value !== undefined
    ) {
      customMeta[key] = value;
    }
  }

  // Only show metadata if there's actual useful custom information
  if (Object.keys(customMeta).length > 0 && !info.stack) {
    const metaStr = JSON.stringify(customMeta);
    if (metaStr.length < 200) {
      output += colors.grey(` ${metaStr}`);
    } else {
      output += colors.grey(`\n${metaStr.substring(0, 200)}...`);
    }
  }

  if (info.stack) {
    output += colors.red(`\n${info.stack}`);
  }

  return output;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] })
  ),
  defaultMeta: { service: "right-fit-matcher" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      format: winston.format.combine(winston.format.json()),
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
      format: winston.format.combine(winston.format.json()),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        levelColorize
      ),
    }),
  ],
});

// if (process.env.NODE_ENV === "production") {
//   logger.transports.find(
//     (t) => t instanceof winston.transports.Console
//   ).silent = true;
// }

logger.success = function (message, meta) {
  this.info(message, { ...meta, level: "success" });
};

module.exports = logger;
