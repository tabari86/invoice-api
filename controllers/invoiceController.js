// controllers/invoiceController.js

const Invoice = require("../models/invoice");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validation/invoiceValidation");

// Alle Rechnungen
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Fehler bei getAllInvoices:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Eine Rechnung nach ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Fehler bei getInvoiceById:", err);
    res.status(400).json({ message: "Ungültige ID" });
  }
};

// Neue Rechnung anlegen (POST /invoices)
exports.createInvoice = async (req, res) => {
  try {
    // ✅ Joi-Validierung
    const { error, value } = createInvoiceSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validierung fehlgeschlagen",
        details: error.details.map((d) => d.message),
      });
    }

    const { customerName, amount } = value;

    const invoice = new Invoice({
      customerName,
      amount,
    });

    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Fehler bei createInvoice:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Rechnung aktualisieren (PUT /invoices/:id)
exports.updateInvoice = async (req, res) => {
  try {
    // ✅ Joi-Validierung
    const { error, value } = updateInvoiceSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validierung fehlgeschlagen",
        details: error.details.map((d) => d.message),
      });
    }

    const { customerName, amount, status } = value;

    const allowedStatus = ["OPEN", "PAID", "CANCELLED"];
    const updateData = {};

    if (typeof customerName === "string") {
      updateData.customerName = customerName;
    }

    if (typeof amount === "number") {
      updateData.amount = amount;
    }

    if (typeof status === "string" && allowedStatus.includes(status)) {
      updateData.status = status;
    }

    const updated = await Invoice.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json({
      message: "Rechnung aktualisiert",
      invoice: updated,
    });
  } catch (err) {
    console.error("Fehler bei updateInvoice:", err);
    res.status(400).json({ message: "Ungültige ID oder Daten" });
  }
};

// Rechnung löschen (DELETE /invoices/:id)
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json({
      message: "Rechnung gelöscht",
      invoice: deleted,
    });
  } catch (err) {
    console.error("Fehler bei deleteInvoice:", err);
    res.status(400).json({ message: "Ungültige ID" });
  }
};
