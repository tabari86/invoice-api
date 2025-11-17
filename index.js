// index.js

// 1) Express laden (Bibliothek importieren)
const express = require("express");

// 2) Express-App erstellen
const app = express();

// 3) Port festlegen (z.B. 3000)
const PORT = 3000;

// 4) Middleware, damit der Server JSON im Body versteht
app.use(express.json());

// 5) Test-Route: GET /
//    Wenn du im Browser http://localhost:3000 aufrufst,
//    bekommst du diese Message zurück.
app.get("/", (req, res) => {
  res.send("Invoice API läuft 🚀");
});

// 6) Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
