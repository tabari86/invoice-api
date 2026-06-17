const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Invoice = require("../models/invoice");

const currentYear = new Date().getFullYear();

function buildInvoice(overrides = {}) {
  return {
    invoiceNumber: `INV-${currentYear}-${String(
      overrides.sequence || 1
    ).padStart(6, "0")}`,
    customer: {
      name: "Test Customer",
      email: "customer@example.com",
    },
    items: [
      {
        description: "Backend API development",
        quantity: 2,
        unitPrice: 100,
        total: 200,
      },
    ],
    subtotal: 200,
    taxRate: 19,
    taxAmount: 38,
    total: 238,
    status: "DRAFT",
    ...overrides,
  };
}

describe("Invoice API", () => {
  beforeEach(async () => {
    await Invoice.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("GET /invoices should return a list of invoices", async () => {
    await Invoice.create([
      buildInvoice({
        sequence: 1,
        customer: {
          name: "Customer A",
          email: "customer-a@example.com",
        },
        subtotal: 100,
        taxAmount: 19,
        total: 119,
        items: [
          {
            description: "API consulting",
            quantity: 1,
            unitPrice: 100,
            total: 100,
          },
        ],
      }),
      buildInvoice({
        sequence: 2,
        customer: {
          name: "Customer B",
          email: "customer-b@example.com",
        },
        subtotal: 200,
        taxAmount: 38,
        total: 238,
        items: [
          {
            description: "Backend implementation",
            quantity: 2,
            unitPrice: 100,
            total: 200,
          },
        ],
      }),
    ]);

    const response = await request(app).get("/invoices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);

    expect(response.body[0]).toHaveProperty("invoiceNumber");
    expect(response.body[0]).toHaveProperty("customer");
    expect(response.body[0]).toHaveProperty("items");
    expect(response.body[0]).toHaveProperty("subtotal");
    expect(response.body[0]).toHaveProperty("taxAmount");
    expect(response.body[0]).toHaveProperty("total");
  });

  it("POST /invoices should create a new invoice with calculated totals", async () => {
    const newInvoice = {
      customer: {
        name: "MT Intelligence",
        email: "billing@mtintelligence.ai",
      },
      items: [
        {
          description: "Backend API development",
          quantity: 5,
          unitPrice: 80,
        },
      ],
      taxRate: 19,
    };

    const response = await request(app).post("/invoices").send(newInvoice);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.invoiceNumber).toMatch(/^INV-\d{4}-\d{6}$/);
    expect(response.body.customer.name).toBe(newInvoice.customer.name);
    expect(response.body.status).toBe("DRAFT");

    expect(response.body.items[0].total).toBe(400);
    expect(response.body.subtotal).toBe(400);
    expect(response.body.taxRate).toBe(19);
    expect(response.body.taxAmount).toBe(76);
    expect(response.body.total).toBe(476);
  });

  it("GET /invoices/:id should return a single invoice", async () => {
    const created = await Invoice.create(
      buildInvoice({
        sequence: 1,
        customer: {
          name: "Single Customer",
          email: "single@example.com",
        },
      })
    );

    const response = await request(app).get(`/invoices/${created._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.invoiceNumber).toBe(created.invoiceNumber);
    expect(response.body.customer.name).toBe("Single Customer");
    expect(response.body.total).toBe(238);
  });

  it("PUT /invoices/:id should update invoice data and recalculate totals", async () => {
    const created = await Invoice.create(
      buildInvoice({
        sequence: 1,
        customer: {
          name: "Old Customer",
          email: "old@example.com",
        },
      })
    );

    const updateData = {
      customer: {
        name: "Updated Customer",
        email: "updated@example.com",
      },
      items: [
        {
          description: "API maintenance",
          quantity: 3,
          unitPrice: 50,
        },
      ],
      taxRate: 19,
    };

    const response = await request(app)
      .put(`/invoices/${created._id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("invoice");

    expect(response.body.invoice.customer.name).toBe("Updated Customer");
    expect(response.body.invoice.items[0].total).toBe(150);
    expect(response.body.invoice.subtotal).toBe(150);
    expect(response.body.invoice.taxAmount).toBe(28.5);
    expect(response.body.invoice.total).toBe(178.5);

    expect(response.body.invoice.status).toBe("DRAFT");
  });

  it("DELETE /invoices/:id should delete an invoice", async () => {
    const created = await Invoice.create(
      buildInvoice({
        sequence: 1,
        customer: {
          name: "Delete Customer",
          email: "delete@example.com",
        },
      })
    );

    const response = await request(app).delete(`/invoices/${created._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Invoice deleted");

    const check = await Invoice.findById(created._id);
    expect(check).toBeNull();
  });
});