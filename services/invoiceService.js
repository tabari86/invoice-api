const Invoice = require("../models/invoice");

const DEFAULT_TAX_RATE = 19;

function roundToTwoDecimals(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function calculateItemTotal(item) {
  return roundToTwoDecimals(item.quantity * item.unitPrice);
}

function calculateInvoiceTotals(items, taxRate = DEFAULT_TAX_RATE) {
  const normalizedTaxRate = Number(taxRate);
  const normalizedItems = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: calculateItemTotal(item),
  }));

  const subtotal = roundToTwoDecimals(
    normalizedItems.reduce((sum, item) => sum + item.total, 0)
  );

  const taxAmount = roundToTwoDecimals((subtotal * normalizedTaxRate) / 100);
  const total = roundToTwoDecimals(subtotal + taxAmount);

  return {
    items: normalizedItems,
    subtotal,
    taxRate: normalizedTaxRate,
    taxAmount,
    total,
  };
}

async function generateInvoiceNumber(date = new Date()) {
  const year = date.getFullYear();
  const prefix = `INV-${year}-`;

  const latestInvoice = await Invoice.findOne({
    invoiceNumber: { $regex: `^${prefix}` },
  })
    .sort({ invoiceNumber: -1 })
    .select("invoiceNumber")
    .lean();

  let nextSequence = 1;

  if (latestInvoice?.invoiceNumber) {
    const currentSequence = Number(
      latestInvoice.invoiceNumber.replace(prefix, "")
    );

    if (!Number.isNaN(currentSequence)) {
      nextSequence = currentSequence + 1;
    }
  }

  return `${prefix}${String(nextSequence).padStart(6, "0")}`;
}

async function getAllInvoices(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.from || filters.to) {
    query.createdAt = {};

    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }

    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  if (
    typeof filters.minAmount === "number" ||
    typeof filters.maxAmount === "number"
  ) {
    query.total = {};

    if (typeof filters.minAmount === "number") {
      query.total.$gte = filters.minAmount;
    }

    if (typeof filters.maxAmount === "number") {
      query.total.$lte = filters.maxAmount;
    }
  }

  return Invoice.find(query).sort({ createdAt: -1 }).lean();
}

async function getInvoiceById(id) {
  return Invoice.findById(id).lean();
}

async function createInvoice({ customer, items, taxRate = DEFAULT_TAX_RATE }) {
  const calculatedValues = calculateInvoiceTotals(items, taxRate);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const invoice = new Invoice({
      invoiceNumber: await generateInvoiceNumber(),
      customer,
      ...calculatedValues,
      status: "DRAFT",
    });

    try {
      return await invoice.save();
    } catch (err) {
      if (err.code === 11000 && attempt < 3) {
        continue;
      }

      throw err;
    }
  }

  throw new Error("Could not generate a unique invoice number.");
}

async function updateInvoice(id, updateData) {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    return null;
  }

  if (updateData.customer) {
    invoice.customer = updateData.customer;
  }

  if (updateData.items || updateData.taxRate !== undefined) {
    const items = updateData.items || invoice.items;
    const taxRate =
      updateData.taxRate !== undefined ? updateData.taxRate : invoice.taxRate;

    const calculatedValues = calculateInvoiceTotals(items, taxRate);

    invoice.items = calculatedValues.items;
    invoice.subtotal = calculatedValues.subtotal;
    invoice.taxRate = calculatedValues.taxRate;
    invoice.taxAmount = calculatedValues.taxAmount;
    invoice.total = calculatedValues.total;
  }

  const savedInvoice = await invoice.save();
  return savedInvoice.toObject();
}

async function issueInvoice(id) {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    return null;
  }

  if (invoice.status !== "DRAFT") {
    const error = new Error("Only draft invoices can be issued.");
    error.statusCode = 409;
    throw error;
  }

  const issuedAt = new Date();
  const dueDate = new Date(issuedAt);
  dueDate.setDate(dueDate.getDate() + 14);

  invoice.status = "OPEN";
  invoice.issuedAt = issuedAt;
  invoice.dueDate = dueDate;

  const savedInvoice = await invoice.save();
  return savedInvoice.toObject();
}

async function deleteInvoice(id) {
  return Invoice.findByIdAndDelete(id).lean();
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  issueInvoice,
};