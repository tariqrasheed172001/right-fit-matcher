const morgan = require("morgan");
const logger = require("../utils/logger");

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream, skip }
);

module.exports = morganMiddleware;
