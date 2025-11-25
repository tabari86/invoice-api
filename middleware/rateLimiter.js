const rateLimit = require("express-rate-limit");

const isTest = process.env.NODE_ENV === "test";

// Basis-Optionen für beide Limiter
const baseOptions = {
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: isTest ? 1000 : 100, // im Test sehr hoch, in echt z.B. 100 Requests
  standardHeaders: true, // RateLimit-Header nach RFC
  legacyHeaders: false, // alte X-RateLimit-Header deaktivieren
};

// Globales Rate-Limit für alle Routen
const globalLimiter = rateLimit({
  ...baseOptions,
});

// Strengeres Limit nur für Schreib-Operationen (POST/PUT/DELETE)
const writeLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000, // 1 Minute
  max: isTest ? 1000 : 10, // im Test hoch, in echt z.B. 10/min
  message: {
    message: "Zu viele Schreibanfragen, bitte später erneut versuchen.",
  },
});

module.exports = {
  globalLimiter,
  writeLimiter,
};
