// index.js

require("dotenv").config();
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
    app.listen(PORT, () => {
      console.log(` Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Konnte nicht mit MongoDB verbinden:", err);
    process.exit(1);
  });
