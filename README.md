# Nipa.Cloud: Pre Interview Assignment for Developer

AN INNOVATIVE, DISCIPLINED PROFESSIONAL TEAM  
Together, We Create Success

## Original Assignment

For full-stack developers.

Build a simple helpdesk support ticket management application, The application must consist of

A RESTful-compliant API backend using any preferred technology stacks.

A SPA-styled frontend application using any preferred JavaScript frontend frameworks with any UI toolkit.

The application must be capable to

Create a new ticket with these pieces of information; title, description, contact information, created timestamp, latest ticket update timestamp.

Update a ticket's information and status (pending, accepted, resolved, rejected).

List and sort tickets by status, latest update, and can filter tickets using status.

Once a ticket is created, it cannot be deleted by any means.

You can introduce any kind of UI workflow, such as a Kanban board for update a ticket's status, etc.

Datastore is your choice, may vary from a database (both SQL and NoSQL), a JSON file, Firebase, even an in-memory store.

What we expect from you are good code architecture layering (Presentation layer, Application layer, Persistence layer), good component decomposition, good aesthetic and creative design, good practices, and good coding habits. bring all best of you.

Remarks

Unit testing, API documentation, and specification, containerization is a plus.

Use your preferred VCS provider (Gitlab, Github, Bitbucket, etc.) to deliver the result.

## Project Summary

This project is a full-stack helpdesk support ticket management application. It includes a RESTful API backend, a SPA frontend, JSON file persistence, unit/API tests, OpenAPI documentation, and Docker containerization.

## Requirement Checklist

| Requirement | Status | Implementation |
| --- | --- | --- |
| RESTful-compliant API backend | Done | Node.js + Express API under `backend/src` |
| SPA-styled frontend | Done | React + Vite app under `frontend/src` |
| Create ticket | Done | `POST /api/tickets` and frontend intake form |
| Ticket fields: title, description, contact information | Done | Validated by Zod and rendered in UI |
| Created timestamp | Done | Backend sets `createdAt` automatically |
| Latest update timestamp | Done | Backend sets and updates `updatedAt` automatically |
| Update ticket information | Done | `PATCH /api/tickets/:id` and edit dialog |
| Update status | Done | Edit dialog, Kanban drag/drop, and quick status actions |
| Status values: pending, accepted, resolved, rejected | Done | Enforced by domain constants and Zod validation |
| List tickets | Done | `GET /api/tickets` and ticket table |
| Sort by status | Done | API query `sortBy=status` and UI sort control |
| Sort by latest update | Done | API query `sortBy=updatedAt` and UI sort control |
| Filter by status | Done | API query `status=pending` and UI filter control |
| Tickets cannot be deleted | Done | `DELETE /api/tickets/:id` returns `405 Method Not Allowed` |
| Kanban workflow | Done | Drag tickets across status columns |
| Datastore | Done | JSON file datastore |
| Good architecture layering | Done | Domain, Application, Persistence, Presentation layers |
| Good component decomposition | Done | Separate React components for form, board, table, card, dialog, badge |
| Unit testing | Done | Node test runner + Supertest, including validation tests |
| API documentation/specification | Done | `backend/openapi.yaml` |
| Containerization | Done | Dockerfiles and Docker Compose |

## Architecture

```text
backend/src
  domain/          Ticket status rules and domain constants
  application/     Ticket use cases
  persistence/     JSON and in-memory repositories
  presentation/    Express routes, request validation, error handling

frontend/src
  components/      Form, Kanban board, cards, table, edit dialog, status badge, empty states
  services/        API client
  utils/           Date formatting helpers
```

## Tech Stack

- Language: JavaScript, HTML, CSS
- Backend: Node.js, Express, Zod, Morgan, CORS
- Frontend: React, Vite, lucide-react, custom CSS
- Datastore: JSON file datastore
- Test datastore: In-memory repository
- Testing: Node.js test runner, Supertest
- API specification: OpenAPI 3.0 YAML
- Containerization: Docker, Docker Compose

## Database / Datastore

The application uses a JSON file datastore.

Local runtime data is stored at:

```text
backend/data/tickets.json
```

Docker runtime data is stored in the Docker volume:

```text
helpdesk-data
```

The volume is mounted inside the API container at:

```text
/app/backend/data/tickets.json
```

## Run Locally

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

## Test And Build

```bash
npm test
npm run build
```

## Run With Docker

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:8080
```

Backend:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

## CI Verification

GitHub Actions is configured in `.github/workflows/ci.yml`.

The workflow verifies:

- `npm ci`
- `npm test`
- `npm run build`
- `docker compose build`

This allows Docker build verification on GitHub even when Docker is not available on the local machine.

## REST API

Main endpoints:

- `GET /health`
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/{id}`
- `PATCH /api/tickets/{id}`
- `DELETE /api/tickets/{id}` returns `405 Method Not Allowed`

List with filter and sort:

```text
GET /api/tickets?status=pending&sortBy=updatedAt&sortDirection=desc
```

Create ticket example:

```json
{
  "title": "Cannot login",
  "description": "The customer cannot login after password reset.",
  "contactInformation": "alex@example.com"
}
```

Update ticket example:

```json
{
  "status": "accepted",
  "title": "Cannot login after reset"
}
```
