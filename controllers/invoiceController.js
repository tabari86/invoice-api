const invoiceService = require("../services/invoiceService");
const logger = require("../utils/logger");

// Get all invoices with optional filters
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
    logger.error(`Error in getAllInvoices: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get one invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    logger.error(`Error in getInvoiceById: ${err.message}`);
    res.status(400).json({ message: "Invalid invoice ID" });
  }
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customer, items, taxRate } = req.body;

    const newInvoice = await invoiceService.createInvoice({
      customer,
      items,
      taxRate,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    logger.error(`Error in createInvoice: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update invoice data
exports.updateInvoice = async (req, res) => {
  try {
    const { customer, items, taxRate } = req.body;

    const updateData = {};

    if (customer) {
      updateData.customer = customer;
    }

    if (items) {
      updateData.items = items;
    }

    if (taxRate !== undefined) {
      updateData.taxRate = taxRate;
    }

    const updatedInvoice = await invoiceService.updateInvoice(
      req.params.id,
      updateData
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice updated",
      invoice: updatedInvoice,
    });
  } catch (err) {
    logger.error(`Error in updateInvoice: ${err.message}`);
    res.status(400).json({ message: "Invalid invoice ID or data" });
  }
};

// Issue invoice
exports.issueInvoice = async (req, res) => {
  try {
    const issuedInvoice = await invoiceService.issueInvoice(req.params.id);

    if (!issuedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice issued",
      invoice: issuedInvoice,
    });
  } catch (err) {
    logger.error(`Error in issueInvoice: ${err.message}`);

    if (err.statusCode === 409) {
      return res.status(409).json({ message: err.message });
    }

    res.status(400).json({ message: "Invalid invoice ID" });
  }
};

// Pay invoice
exports.payInvoice = async (req, res) => {
  try {
    const paidInvoice = await invoiceService.payInvoice(req.params.id);

    if (!paidInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice paid",
      invoice: paidInvoice,
    });
  } catch (err) {
    logger.error(`Error in payInvoice: ${err.message}`);

    if (err.statusCode === 409) {
      return res.status(409).json({ message: err.message });
    }

    res.status(400).json({ message: "Invalid invoice ID" });
  }
};

// Cancel invoice
exports.cancelInvoice = async (req, res) => {
  try {
    const cancelledInvoice = await invoiceService.cancelInvoice(req.params.id);

    if (!cancelledInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice cancelled",
      invoice: cancelledInvoice,
    });
  } catch (err) {
    logger.error(`Error in cancelInvoice: ${err.message}`);

    if (err.statusCode === 409) {
      return res.status(409).json({ message: err.message });
    }

    res.status(400).json({ message: "Invalid invoice ID" });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await invoiceService.deleteInvoice(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice deleted",
      invoice: deletedInvoice,
    });
  } catch (err) {
    logger.error(`Error in deleteInvoice: ${err.message}`);
    res.status(400).json({ message: "Invalid invoice ID" });
  }
};
