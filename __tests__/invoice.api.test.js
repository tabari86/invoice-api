const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");

// HIER ändern:
const Invoice = require("../models/invoice");

describe("Invoice API", () => {
  // Vor jedem Test: alle Rechnungen aus der Test-Datenbank löschen
  beforeEach(async () => {
    await Invoice.deleteMany({});
  });

  // Nach allen Tests: MongoDB-Verbindung schließen
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("GET /invoices sollte eine Liste von Rechnungen zurückgeben", async () => {
    // Testdaten in der Test-DB anlegen
    await Invoice.create([
      { customerName: "Testkunde A", amount: 100 },
      { customerName: "Testkunde B", amount: 200 },
    ]);

    const response = await request(app).get("/invoices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);

    // einfache Struktur-Prüfung
    expect(response.body[0]).toHaveProperty("customerName");
    expect(response.body[0]).toHaveProperty("amount");
    expect(typeof response.body[0].customerName).toBe("string");
    expect(typeof response.body[0].amount).toBe("number");
  });

  it("POST /invoices sollte eine neue Rechnung anlegen", async () => {
    const newInvoice = {
      customerName: "MT Intelligence",
      amount: 350.75,
    };

    const response = await request(app).post("/invoices").send(newInvoice);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.customerName).toBe(newInvoice.customerName);
    expect(response.body.amount).toBe(newInvoice.amount);
    expect(response.body.status).toBe("OPEN"); // Default-Wert
  });
  it("GET /invoices/:id sollte eine einzelne Rechnung zurückgeben", async () => {
    // Zuerst eine Testrechnung direkt in der Test-DB anlegen
    const created = await Invoice.create({
      customerName: "Einzelkunde",
      amount: 123.45,
    });

    const response = await request(app).get(`/invoices/${created._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.customerName).toBe("Einzelkunde");
    expect(response.body.amount).toBe(123.45);
  });

  it("PUT /invoices/:id sollte eine Rechnung aktualisieren", async () => {
    // Zuerst eine neue Rechnung anlegen
    const created = await Invoice.create({
      customerName: "Update Test",
      amount: 50,
      status: "OPEN",
    });

    // Aktualisieren
    const response = await request(app).put(`/invoices/${created._id}`).send({
      customerName: "Update Erfolgreich",
      amount: 99.99,
      status: "PAID",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("invoice");
    expect(response.body.invoice.customerName).toBe("Update Erfolgreich");
    expect(response.body.invoice.amount).toBe(99.99);
    expect(response.body.invoice.status).toBe("PAID");
  });

  it("PUT /invoices/:id sollte eine Rechnung aktualisieren", async () => {
    // Zuerst eine Rechnung in der Test-DB anlegen
    const created = await Invoice.create({
      customerName: "Alter Kunde",
      amount: 50,
      status: "OPEN",
    });

    const updateData = {
      customerName: "Aktualisierter Kunde",
      amount: 99.99,
      status: "PAID",
    };

    const response = await request(app)
      .put(`/invoices/${created._id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("invoice");
    expect(response.body.invoice.customerName).toBe(updateData.customerName);
    expect(response.body.invoice.amount).toBe(updateData.amount);
    expect(response.body.invoice.status).toBe(updateData.status);
  });

  it("DELETE /invoices/:id sollte eine Rechnung löschen", async () => {
    // 1) Eine Testrechnung anlegen
    const created = await Invoice.create({
      customerName: "Löschkunde",
      amount: 999.99,
    });

    // 2) DELETE-Request ausführen
    const response = await request(app).delete(`/invoices/${created._id}`);

    // 3) Erwartung: erfolgreiche Löschung
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Rechnung gelöscht");

    // 4) Sicherstellen, dass sie wirklich nicht mehr existiert
    const check = await Invoice.findById(created._id);
    expect(check).toBeNull();
  });
});
