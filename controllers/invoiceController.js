const invoiceService = require("../services/invoiceService");

// Alle Rechnungen
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    console.error("Fehler bei getAllInvoices:", err);
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
    console.error("Fehler bei getInvoiceById:", err);
    // z.B. ungültige ObjectId
    res.status(400).json({ message: "Ungültige ID" });
  }
};

// Neue Rechnung anlegen
exports.createInvoice = async (req, res) => {
  try {
    // Body ist bereits durch Joi (validateRequest) geprüft
    const { customerName, amount } = req.body;

    const saved = await invoiceService.createInvoice({
      customerName,
      amount,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Fehler bei createInvoice:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Rechnung aktualisieren
exports.updateInvoice = async (req, res) => {
  try {
    // Body wurde schon von Joi validiert (updateInvoiceSchema)
    const { customerName, amount, status } = req.body;

    const updateData = {};

    if (typeof customerName === "string") {
      updateData.customerName = customerName;
    }

    if (typeof amount === "number") {
      updateData.amount = amount;
    }

    if (typeof status === "string") {
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
    console.error("Fehler bei updateInvoice:", err);
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
    console.error("Fehler bei deleteInvoice:", err);
    res.status(400).json({ message: "Ungültige ID" });
  }
};
