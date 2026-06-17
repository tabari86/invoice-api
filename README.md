# Invoice API

![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-API-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Jest](https://img.shields.io/badge/Tests-Passing-success?logo=jest)
![Swagger](https://img.shields.io/badge/OpenAPI-3.0-brightgreen)

A backend-focused REST API for managing invoices with line items, automatic tax calculation, MongoDB persistence, Swagger documentation, Docker support and automated API tests.

---

## About the Project

Invoice API is a portfolio backend project that simulates a realistic invoice management service for small business or agency workflows.

The project is intentionally focused on backend architecture, business logic and API design.
It is not a frontend project and not a simple tutorial CRUD example.

The API supports creating, reading, updating and deleting invoices. Each invoice contains structured customer data, invoice line items and calculated totals. The backend calculates item totals, subtotal, tax amount and final invoice total automatically.

---

## Business Context

A real invoice system should not rely on manually entered final amounts only.
This API models invoices with:

* Unique invoice numbers
* Customer information
* Invoice line items
* Quantity and unit price per item
* Automatic subtotal calculation
* Tax calculation with a default tax rate of 19%
* Final total calculation
* Invoice status handling

New invoices are created as drafts and receive an automatically generated invoice number in the following format:

```text
INV-YYYY-000001
```

Example:

```text
INV-2026-000001
```

---

## Features

| Feature         | Description                                          |
| --------------- | ---------------------------------------------------- |
| Invoice CRUD    | Create, read, update and delete invoices             |
| Invoice Numbers | Automatic invoice number generation                  |
| Line Items      | Invoices contain one or more billable items          |
| Tax Calculation | Automatic subtotal, tax amount and total calculation |
| MongoDB         | Persistent invoice storage with Mongoose             |
| Validation      | Request validation with Joi                          |
| Swagger         | Interactive OpenAPI documentation                    |
| Logging         | HTTP request logging with Morgan and Winston         |
| Rate Limiting   | Global and write-operation rate limits               |
| Monitoring      | Health and metrics endpoints                         |
| Tests           | Automated API tests with Jest and Supertest          |
| Docker          | Containerized application setup                      |

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi
* Jest
* Supertest
* Swagger / OpenAPI
* Docker
* Winston
* Morgan

---

## API Documentation

Swagger UI is available after starting the application:

```text
http://localhost:3000/api-docs
```

### Swagger Preview

![Swagger UI](docs/swagger-ui.png)

---

## API Endpoints

### Invoices

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/invoices`     | Get all invoices             |
| GET    | `/invoices/:id` | Get invoice by ID            |
| POST   | `/invoices`     | Create a new draft invoice   |
| PUT    | `/invoices/:id` | Update editable invoice data |
| DELETE | `/invoices/:id` | Delete invoice               |

### Monitoring

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/monitor/health`  | API and database health status |
| GET    | `/monitor/metrics` | Basic runtime metrics          |

---

## Example Create Invoice Request

```json
{
  "customer": {
    "name": "MT Intelligence",
    "email": "billing@mtintelligence.ai",
    "address": {
      "street": "Example Street 12",
      "city": "Stuttgart",
      "postalCode": "70173",
      "country": "Germany"
    }
  },
  "items": [
    {
      "description": "Backend API development",
      "quantity": 5,
      "unitPrice": 80
    }
  ],
  "taxRate": 19
}
```

---

## Example Invoice Response

```json
{
  "_id": "6656f3c0e2a1d9f8b4a12345",
  "invoiceNumber": "INV-2026-000001",
  "customer": {
    "name": "MT Intelligence",
    "email": "billing@mtintelligence.ai",
    "address": {
      "street": "Example Street 12",
      "city": "Stuttgart",
      "postalCode": "70173",
      "country": "Germany"
    }
  },
  "items": [
    {
      "description": "Backend API development",
      "quantity": 5,
      "unitPrice": 80,
      "total": 400
    }
  ],
  "subtotal": 400,
  "taxRate": 19,
  "taxAmount": 76,
  "total": 476,
  "status": "DRAFT",
  "issuedAt": null,
  "dueDate": null,
  "paidAt": null,
  "cancelledAt": null
}
```

---

## Project Structure

```text
invoice-api/
│
├── controllers/
├── docs/
├── middleware/
├── models/
├── routes/
├── services/
├── swagger/
├── tests/
├── utils/
│
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/invoice-api
```

### Test Environment

The project uses a separate test environment configuration:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/invoice-api-test
```

No production credentials are stored in the repository.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/tabari86/invoice-api.git
cd invoice-api
```

Install dependencies:

```bash
npm install
```

---

## Start Application

Start the API:

```bash
npm start
```

The application runs on:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api-docs
```

---

## Run Tests

```bash
npm test
```

The test suite covers the main invoice API endpoints and verifies invoice creation, automatic total calculation, invoice retrieval, updates and deletion.

---

## Docker

Build the Docker image:

```bash
docker build -t invoice-api .
```

Run the container:

```bash
docker run -p 3000:3000 invoice-api
```

If MongoDB is managed through Docker Compose, start the services with:

```bash
docker compose up --build
```

---

## Current Scope

The current version focuses on the core invoice backend:

* Clean REST API structure
* Invoice creation with calculated totals
* MongoDB persistence
* Request validation
* Swagger documentation
* Automated API tests
* Docker support
* Basic monitoring and logging

Invoice lifecycle actions such as issuing, paying and cancelling invoices are planned as dedicated business endpoints instead of being handled through a generic update request.

Planned endpoints:

```text
PATCH /invoices/:id/issue
PATCH /invoices/:id/pay
PATCH /invoices/:id/cancel
```

---

## Author

**Mojtaba Tabari**

Website:
https://mtintelligence.ai

LinkedIn:
https://www.linkedin.com/in/moj-tabari-04a400227/
