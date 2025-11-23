// validation/invoiceValidation.js

const Joi = require("joi");

// Schema für POST /invoices
const createInvoiceSchema = Joi.object({
  customerName: Joi.string().min(2).required(),
  amount: Joi.number().positive().required(),
});

// Schema für PUT /invoices/:id
const updateInvoiceSchema = Joi.object({
  customerName: Joi.string().min(2).optional(),
  amount: Joi.number().positive().optional(),
  status: Joi.string().valid("OPEN", "PAID", "CANCELLED").optional(),
}).min(1); // mindestens ein Feld muss gesetzt sein

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};
