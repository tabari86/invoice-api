const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["OPEN", "PAID", "CANCELLED"],
      default: "OPEN",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

/**
 * Indexe für häufige Abfragen:
 * - nach Status und Datum (alle OPEN-Rechnungen, sortiert nach Datum)
 */
invoiceSchema.index({ status: 1, createdAt: -1 });

/**
 * schneller Zugriff auf neueste Rechnungen allgemein
 */
// invoiceSchema.index({ createdAt: -1 });

// Modell registrieren
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
