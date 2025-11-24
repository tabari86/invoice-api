const Invoice = require("../models/invoice");

/**
 * Alle Rechnungen aus der DB holen – optional mit Filtern.
 *
 * filters = {
 *   status?: "OPEN" | "PAID" | "CANCELLED",
 *   from?: Date/String,
 *   to?: Date/String,
 *   minAmount?: Number,
 *   maxAmount?: Number,
 * }
 */
async function getAllInvoices(filters = {}) {
  const query = {};

  // Status-Filter (nutzt unseren Index: { status: 1, createdAt: -1 })
  if (filters.status) {
    query.status = filters.status;
  }

  // Datumsbereich
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  // Betragsbereich
  if (typeof filters.minAmount === "number") {
    query.amount = query.amount || {};
    query.amount.$gte = filters.minAmount;
  }
  if (typeof filters.maxAmount === "number") {
    query.amount = query.amount || {};
    query.amount.$lte = filters.maxAmount;
  }

  // .lean() -> schnellere, "leichtere" Objekte
  return Invoice.find(query).sort({ createdAt: -1 }).lean();
}

// Eine Rechnung nach ID holen
async function getInvoiceById(id) {
  return Invoice.findById(id).lean();
}

// Neue Rechnung anlegen
async function createInvoice({ customerName, amount }) {
  const invoice = new Invoice({
    customerName,
    amount,
  });

  return invoice.save();
}

// Rechnung aktualisieren
async function updateInvoice(id, updateData) {
  return Invoice.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();
}

// Rechnung löschen
async function deleteInvoice(id) {
  return Invoice.findByIdAndDelete(id).lean();
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
