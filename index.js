const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const path = require("path");

// je nach Umgebung die richtige .env-Datei laden
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

require("dotenv").config({
  path: path.resolve(__dirname, envFile),
});

const express = require("express");
const mongoose = require("mongoose");
const invoiceRoutes = require("./routes/invoiceRoutes");
const { globalLimiter } = require("./middleware/rateLimiter");

const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Body-Parsing
app.use(express.json());
// Globales Rate-Limit für alle Requests
app.use(globalLimiter);

// 🔹 NEU: HTTP-Request-Logging (muss VOR den Routen kommen)
app.use(requestLogger);

// einfache Health-Route
app.get("/", (req, res) => {
  res.send("Invoice API mit MongoDB, Tests & professionellem Logging läuft 🚀");
});

// Swagger UI unter /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// alle Invoice-Routen unter /invoices
app.use("/invoices", invoiceRoutes);

// MongoDB verbinden und Server starten
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info("✅ Mit MongoDB verbunden");

    // Server nur starten, wenn wir NICHT im Test-Modus sind
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        logger.info(`Server läuft auf http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    logger.error(`Fehler bei Mongo-Verbindung: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
