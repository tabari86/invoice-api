// 1) Express laden (Bibliothek importieren)
const express = require("express");

// 2) Express-App erstellen
const app = express();

// 3) Port festlegen (z.B. 3000)
const PORT = 3000;

// "Pseudo-Datenbank" im Arbeitsspeicher
let invoices = [
  {
    id: 1,
    customerName: "Testkunde GmbH",
    amount: 199.99,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  },
];

// 4) Middleware, damit der Server JSON im Body versteht
app.use(express.json());

// 5) Test-Route: GET /
//    im Browser http://localhost:3000 aufrufst,
app.get("/", (req, res) => {
  res.send("Invoice API läuft 🚀");
});

// Alle Rechnungen zurückgeben
app.get("/invoices", (req, res) => {
  res.json(invoices);
});

// Einzelne Rechnung nach ID
app.get("/invoices/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return res.status(404).json({ message: "Rechnung nicht gefunden" });
  }

  res.json(invoice);
});

// Neue Rechnung anlegen
app.post("/invoices", (req, res) => {
  const { customerName, amount } = req.body;

  // einfache Validierung
  if (!customerName || typeof amount !== "number") {
    return res.status(400).json({
      message: "customerName und amount sind erforderlich",
    });
  }

  // neue ID berechnen
  const newId = invoices.length > 0 ? invoices[invoices.length - 1].id + 1 : 1;

  const newInvoice = {
    id: newId,
    customerName,
    amount,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  invoices.push(newInvoice);

  // 201 = "Created"
  res.status(201).json(newInvoice);
});

// Rechnung aktualisieren (PUT)
app.put("/invoices/:id", (req, res) => {
  console.log("PUT-Route wurde aufgerufen mit ID:", req.params.id);

  const id = parseInt(req.params.id, 10);

  // Rechnung suchen
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return res.status(404).json({ message: "Rechnung nicht gefunden" });
  }

  // Felder aus dem Body holen
  const { customerName, amount, status } = req.body;

  // Nur die Felder überschreiben, die wirklich gesendet wurden
  if (typeof customerName === "string") {
    invoice.customerName = customerName;
  }

  if (typeof amount === "number") {
    invoice.amount = amount;
  }

  // optional: status nur bestimmten Werten erlauben
  const allowedStatus = ["OPEN", "PAID", "CANCELLED"];
  if (typeof status === "string" && allowedStatus.includes(status)) {
    invoice.status = status;
  }

  res.json({
    message: "Rechnung aktualisiert",
    invoice,
  });
});

// Rechnung löschen
app.delete("/invoices/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Index der Rechnung im Array finden
  const index = invoices.findIndex((inv) => inv.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Rechnung nicht gefunden" });
  }

  // Rechnung aus dem Array entfernen
  const deletedInvoice = invoices.splice(index, 1)[0];

  res.json({
    message: "Rechnung gelöscht",
    invoice: deletedInvoice,
  });
});

// 6) Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
