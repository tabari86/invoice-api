# invoice-api
Über das Projekt

Dieses Projekt ist eine modular aufgebaute und bewusst schlank gehaltene REST-API zur Verwaltung von Rechnungen.
Der Fokus liegt auf einem klaren, nachvollziehbaren Codeaufbau, wie er in realen Backend-Projekten üblich ist.
Die API bietet eine vollständige CRUD-Implementierung und dient als Grundlage für weiterführende Features wie Datenbank-Integration, Benutzerverwaltung oder API-Security.
Das Projekt eignet sich gut, um Backend-Grundlagen sauber zu demonstrieren und wird aktiv weiterentwickelt.

 ## Ziele & Motivation

Dieses Projekt wurde entwickelt, um:
Backend-Strukturen realistisch abzubilden
saubere REST-Architektur zu zeigen
API-Design für Bewerbungen zu demonstrieren
eine Basis für zukünftige Erweiterungen (MongoDB, Auth, Services) zu schaffen
Node.js, Express und API-Routing strukturiert einzusetzen

## Features

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

## Technologien

Node.js
Express.js
JavaScript (ES6+)
REST-API Architektur

## Installation & Setup

1. Projekt klonen
git clone https://github.com/tabari86/invoice-api.git
cd invoice-api

2. Abhängigkeiten installieren
npm install

3. Server starten
node index.js

Der Server läuft auf:
http://localhost:3000

## API Endpunkte
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

## Datenbank & Architektur

Die API verwendet MongoDB als persistente Datenbank und Mongoose als ODM-Schicht.  
Die ursprüngliche In-Memory-Variante (Array) wurde durch ein sauberes Schichtenmodell ersetzt:

- `models/` – Mongoose Models (z.B. `Invoice`)
- `controllers/` – Businesslogik und Request-Handling
- `routes/` – Express-Routing, Zuordnung von URLs zu Controllern
- `index.js` – Anwendungseintritt, Verbindungsaufbau zu MongoDB, Einbinden der Routen

Diese Struktur orientiert sich an typischen Node.js/Express-Projekten in produktiven Umgebungen und erleichtert Wartung, Erweiterung und Testbarkeit.


## Database & Architecture

The API uses MongoDB as a persistent data store and Mongoose as the ODM layer.  
The initial in-memory implementation (simple array) has been refactored into a layered architecture:

- `models/` – Mongoose models (e.g. `Invoice`)
- `controllers/` – business logic and request handling
- `routes/` – Express routing, mapping URLs to controllers
- `index.js` – application entry point, MongoDB connection, route registration

This structure follows common Node.js/Express patterns used in real-world projects and improves maintainability, extensibility and testability.

##  Tests (DE)

Das Projekt verwendet Jest und Supertest, um die API-Endpunkte automatisiert zu prüfen.
Die Tests laufen in einer eigenen MongoDB-Testdatenbank (.env.test) und beeinträchtigen deshalb niemals die echten Daten.

## Docker & Deployment
Dieses Projekt kann sowohl lokal (Node.js direkt) als auch vollständig in Docker ausgeführt werden.

 # Voraussetzungen
Docker Desktop installiert (Windows / macOS)
Docker Compose verfügbar
Lokale Entwicklung (ohne Docker)

# Abhängigkeiten installieren
npm install

# Entwicklung mit lokaler MongoDB
node index.js
# oder
npm start

Die API ist dann unter:

http://localhost:3000/invoices erreichbar.

# Ausführung mit Docker & docker-compose

Im Projektordner:
docker-compose up --build
Dadurch werden:
# API-Container (Node.js) gestartet
# MongoDB-Container gestartet

die Verbindung erfolgt intern über die Connection-URL:

# MONGODB_URI=mongodb://mongo:27017/invoice-api

Nach dem Start ist die API wieder unter:

http://localhost:3000/invoices von außen erreichbar.

# Container stoppen:
docker-compose down

# Typischer Workflow

Lokales Entwickeln, Testen & Debuggen mit:
npm test
npm start

Für Demo / Deployment / GitHub-Showcase:
docker-compose up --build


## Ausblick / Weiterentwicklung

Geplante Erweiterungen:

MongoDB-Integration (persistente Speicherung)
Struktur in Services/Controller aufteilen
Request-Validierung mit Joi/Zod
Authentifizierung / API-Keys


Dieses Projekt dient bewusst als solide Basis.









