const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string().trim().allow("").optional(),
  city: Joi.string().trim().allow("").optional(),
  postalCode: Joi.string().trim().allow("").optional(),
  country: Joi.string().trim().default("Germany").optional(),
});

const customerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().trim().lowercase().optional(),
  address: addressSchema.optional(),
});

const invoiceItemSchema = Joi.object({
  description: Joi.string().trim().min(2).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).required(),
});

const createInvoiceSchema = Joi.object({
  customer: customerSchema.required(),
  items: Joi.array().items(invoiceItemSchema).min(1).required(),
  taxRate: Joi.number().min(0).max(100).default(19),
});

const updateInvoiceSchema = Joi.object({
  customer: customerSchema.optional(),
  items: Joi.array().items(invoiceItemSchema).min(1).optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
}).min(1);

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};