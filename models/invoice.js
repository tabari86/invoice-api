// models/invoice.js

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
    versionKey: false, // kein __v-Feld
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
