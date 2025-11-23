// index.js

const path = require("path");

// je nach Umgebung die richtige .env-Datei laden
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

require("dotenv").config({
  path: path.resolve(__dirname, envFile),
});

const express = require("express");
const mongoose = require("mongoose");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

// einfache Health-Route
app.get("/", (req, res) => {
  res.send("Invoice API mit MongoDB & strukturierter Architektur läuft 🚀");
});

// alle Invoice-Routen unter /invoices
app.use("/invoices", invoiceRoutes);

// MongoDB verbinden und Server starten
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Mit MongoDB verbunden");

    // Server nur starten, wenn wir NICHT im Test-Modus sind
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Fehler bei Mongo-Verbindung:", err.message);
    process.exit(1);
  });

module.exports = app;
