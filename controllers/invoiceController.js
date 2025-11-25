const invoiceService = require("../services/invoiceService");
const logger = require("../utils/logger");

// Alle Rechnungen – optional mit Filtern
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, from, to, minAmount, maxAmount } = req.query;

    const filters = {};

    if (status) {
      filters.status = status;
    }
    if (from) {
      filters.from = from;
    }
    if (to) {
      filters.to = to;
    }
    if (minAmount) {
      const parsed = Number(minAmount);
      if (!Number.isNaN(parsed)) {
        filters.minAmount = parsed;
      }
    }
    if (maxAmount) {
      const parsed = Number(maxAmount);
      if (!Number.isNaN(parsed)) {
        filters.maxAmount = parsed;
      }
    }

    const invoices = await invoiceService.getAllInvoices(filters);
    res.json(invoices);
  } catch (err) {
    logger.error(`Fehler bei getAllInvoices: ${err.message}`);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Eine Rechnung nach ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json(invoice);
  } catch (err) {
    logger.error(`Fehler bei getAllInvoices: ${err.message}`);
    res.status(400).json({ message: "Ungültige ID" });
  }
};

// Neue Rechnung anlegen
exports.createInvoice = async (req, res) => {
  try {
    const { customerName, amount } = req.body;

    const newInvoice = await invoiceService.createInvoice({
      customerName,
      amount,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    logger.error(`Fehler bei getAllInvoices: ${err.message}`);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Rechnung aktualisieren
exports.updateInvoice = async (req, res) => {
  try {
    const { customerName, amount, status } = req.body;

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

    const updated = await invoiceService.updateInvoice(
      req.params.id,
      updateData
    );

    if (!updated) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json({
      message: "Rechnung aktualisiert",
      invoice: updated,
    });
  } catch (err) {
    logger.error(`Fehler bei getAllInvoices: ${err.message}`);
    res.status(400).json({ message: "Ungültige ID oder Daten" });
  }
};

// Rechnung löschen
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await invoiceService.deleteInvoice(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Rechnung nicht gefunden" });
    }

    res.json({
      message: "Rechnung gelöscht",
      invoice: deleted,
    });
  } catch (err) {
    logger.error(`Fehler bei getAllInvoices: ${err.message}`);
    res.status(400).json({ message: "Ungültige ID" });
  }
};
