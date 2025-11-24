const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validation/invoiceValidation");

const validateRequest = require("../middleware/validateRequest");

// GET /invoices
router.get("/", invoiceController.getAllInvoices);

// GET /invoices/:id
router.get("/:id", invoiceController.getInvoiceById);

// POST /invoices - mit Validation
router.post(
  "/",
  validateRequest(createInvoiceSchema),
  invoiceController.createInvoice
);

// PUT /invoices/:id – mit Validation
router.put(
  "/:id",
  validateRequest(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// DELETE /invoices/:id
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
