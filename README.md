# invoice-api
Über das Projekt

Dieses Projekt ist eine modular aufgebaute und bewusst schlank gehaltene REST-API zur Verwaltung von Rechnungen.
Der Fokus liegt auf einem klaren, nachvollziehbaren Codeaufbau, wie er in realen Backend-Projekten üblich ist.
Die API bietet eine vollständige CRUD-Implementierung und dient als Grundlage für weiterführende Features wie Datenbank-Integration, Benutzerverwaltung oder API-Security.
Das Projekt eignet sich gut, um Backend-Grundlagen sauber zu demonstrieren und wird aktiv weiterentwickelt.

Ziele & Motivation

Dieses Projekt wurde entwickelt, um:
Backend-Strukturen realistisch abzubilden
saubere REST-Architektur zu zeigen
API-Design für Bewerbungen zu demonstrieren
eine Basis für zukünftige Erweiterungen (MongoDB, Auth, Services) zu schaffen
Node.js, Express und API-Routing strukturiert einzusetzen

Features

Vollständige CRUD-Funktionalität:
GET /invoices
GET /invoices/:id
POST /invoices
PUT /invoices/:id
DELETE /invoices/:id
Sauberes Error-Handling
Express Middleware für JSON-Parsing
Struktur wie im realen Entwicklungsalltag
Erweiterbar (MongoDB, Services, Auth, Validation, Logging) 

Technologien

Node.js
Express.js
JavaScript (ES6+)
REST-API Architektur

Installation & Setup

1. Projekt klonen
git clone https://github.com/tabari86/invoice-api.git
cd invoice-api

2. Abhängigkeiten installieren
npm install

3. Server starten
node index.js

Der Server läuft auf:
http://localhost:3000

API Endpunkte
📌 Alle Rechnungen abrufen
GET /invoices

📌 Rechnung per ID abrufen
GET /invoices/:id

📌 Neue Rechnung erstellen
POST /invoices
Body (JSON-Beispiel):
{
  "customerName": "MT Intelligence",
  "amount": 250.50
}

📌 Rechnung aktualisieren
PUT /invoices/:id

📌 Rechnung löschen
DELETE /invoices/:id

Ausblick / Weiterentwicklung

Geplante Erweiterungen:

MongoDB-Integration (persistente Speicherung)
Struktur in Services/Controller aufteilen
Request-Validierung mit Joi/Zod
Unit- und Integrationstests
Authentifizierung / API-Keys
Docker-Support

Dieses Projekt dient bewusst als solide Basis.









