const levels = ["debug", "info", "warn", "error"];

// Standard-Log-Level (kannst du z.B. über .env setzen: LOG_LEVEL=debug)
const currentLevel = process.env.LOG_LEVEL || "info";

function shouldLog(level) {
  const currentIndex = levels.indexOf(currentLevel);
  const levelIndex = levels.indexOf(level);
  if (currentIndex === -1 || levelIndex === -1) {
    // Fallback: wenn etwas komisch ist, lieber loggen als schweigen
    return true;
  }
  return levelIndex >= currentIndex;
}

function log(level, message) {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  // einfache Variante: alles auf stdout
  // (später könnte man hier z.B. in Dateien schreiben oder nach Loki/ELK schicken)
  // falls message ein Objekt ist, schön formatieren
  if (message instanceof Error) {
    console.log(`${prefix} ${message.message}\n${message.stack}`);
  } else if (typeof message === "object") {
    console.log(`${prefix} ${JSON.stringify(message)}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

module.exports = {
  debug: (msg) => log("debug", msg),
  info: (msg) => log("info", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
};
