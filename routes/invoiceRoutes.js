// routes/invoiceRoutes.js

const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");

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

// POST /invoices - mit Validation & Write-Limiter
router.post(
  "/",
  writeLimiter, //  Write-Limiter
  validateRequest(createInvoiceSchema),
  invoiceController.createInvoice
);

// PUT /invoices/:id – mit Validation & Write-Limiter
router.put(
  "/:id",
  writeLimiter, // Write-Limiter
  validateRequest(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// DELETE /invoices/:id – mit Write-Limiter
router.delete("/:id", writeLimiter, invoiceController.deleteInvoice);

//  Router exportieren
module.exports = router;
