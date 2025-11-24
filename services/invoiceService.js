const Invoice = require("../models/invoice");

// Alle Rechnungen aus der DB holen
async function getAllInvoices() {
  return Invoice.find().sort({ createdAt: -1 });
}

// Eine Rechnung nach ID holen
async function getInvoiceById(id) {
  return Invoice.findById(id);
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
  });
}

// Rechnung löschen
async function deleteInvoice(id) {
  return Invoice.findByIdAndDelete(id);
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
