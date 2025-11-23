const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");

describe("GET /invoices", () => {
  it("sollte eine Liste von Rechnungen zurückgeben (Array)", async () => {
    const response = await request(app).get("/invoices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// nach allen Tests: MongoDB-Verbindung schließen
afterAll(async () => {
  await mongoose.connection.close();
});
