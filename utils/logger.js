// Ein sehr einfacher Logger-Wrapper um console.log / console.error
// So können wir später leicht auf ein "echtes" Logging-Tool wechseln (z.B. pino, winston)

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();

  // Falls meta-Objekt mitgegeben wird, hängen wir es an
  if (meta) {
    return `[${timestamp}] [${level}] ${message} | ${JSON.stringify(meta)}`;
  }

  return `[${timestamp}] [${level}] ${message}`;
}

const logger = {
  info(message, meta) {
    console.log(formatMessage("INFO", message, meta));
  },

  error(message, meta) {
    console.error(formatMessage("ERROR", message, meta));
  },

  warn(message, meta) {
    console.warn(formatMessage("WARN", message, meta));
  },

  debug(message, meta) {
    console.debug(formatMessage("DEBUG", message, meta));
  },
};

module.exports = logger;
