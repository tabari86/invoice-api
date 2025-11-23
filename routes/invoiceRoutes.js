const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validation/invoiceValidation");

// Middleware für Validation
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validierungsfehler",
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
}

// /invoices/
router.get("/", invoiceController.getAllInvoices);

// /invoices/:id
router.get("/:id", invoiceController.getInvoiceById);

// POST mit Validation
router.post(
  "/",
  validate(createInvoiceSchema),
  invoiceController.createInvoice
);

// PUT mit Validation
router.put(
  "/:id",
  validate(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// DELETE
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
