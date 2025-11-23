const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// /invoices/
router.get("/", invoiceController.getAllInvoices);

// /invoices/:id
router.get("/:id", invoiceController.getInvoiceById);

// /invoices/
router.post("/", invoiceController.createInvoice);

// /invoices/:id
router.put("/:id", invoiceController.updateInvoice);

// /invoices/:id
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
