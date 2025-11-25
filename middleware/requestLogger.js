

const morgan = require("morgan");
const logger = require("../utils/logger");

// Winston als Ziel für Morgan-Logs verwenden
const stream = {
  write: (message) => {
    // message enthält einen Zeilenumbruch am Ende -> trim()
    logger.http ? logger.http(message.trim()) : logger.info(message.trim());
  },
};

// Optional können wir bestimmte Pfade ignorieren (z. B. Health-Check)
const skip = (req, res) => {
  return req.path === "/";
};

const requestLogger = morgan("combined", { stream, skip });

module.exports = requestLogger;
