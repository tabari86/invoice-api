// utils/logger.js
// Einfacher Logger, damit wir überall saubere Logs haben,
// ohne zusätzliche npm-Pakete (winston, pino, etc.)

function log(level, ...args) {
  const timestamp = new Date().toISOString();
  const tag = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case "error":
      console.error(tag, ...args);
      break;
    case "warn":
      console.warn(tag, ...args);
      break;
    case "info":
      console.info(tag, ...args);
      break;
    default:
      console.log(tag, ...args);
  }
}

module.exports = {
  info: (...args) => log("info", ...args),
  warn: (...args) => log("warn", ...args),
  error: (...args) => log("error", ...args),
  debug: (...args) => log("debug", ...args),
};

