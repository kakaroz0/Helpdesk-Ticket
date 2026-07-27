## Requirement Checklist

###  Core Tech Stack
| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **RESTful API Backend** | ✅ Done | Node.js + Express REST API (`backend/src`) |
| **SPA Frontend** | ✅ Done | React + Vite Single Page App (`frontend/src`) |
| **Datastore** | ✅ Done | JSON File datastore (`backend/data/tickets.json`) |

###  Ticket Features & Operations
| Feature | Status | Implementation Details |
| :--- | :---: | :--- |
| **Create Ticket** | ✅ Done | `POST /api/tickets` + Intake form (`title`, `description`, `contactInformation`) |
| **Auto Timestamps** | ✅ Done | Backend automatically sets `createdAt` and updates `updatedAt` |
| **Update Info & Status** | ✅ Done | `PATCH /api/tickets/:id` + Edit dialog (`pending`, `accepted`, `resolved`, `rejected`) |
| **Immutable Records** | ✅ Done | `DELETE /api/tickets/:id` returns `405 Method Not Allowed` |
| **List, Filter & Sort** | ✅ Done | `GET /api/tickets` + Status filter & Sort controls (`updatedAt`, `createdAt`, `status`) |
| **Keyword Search** | ✅ Done | Real-time Search Bar for Title, Description & Contact info |

###  UI/UX & Workflows
| Workflow / Element | Status | Implementation Details |
| :--- | :---: | :--- |
| **Kanban Board** | ✅ Done | Interactive Drag & Drop board across 4 status columns |
| **Quick Actions** | ✅ Done | Quick status change buttons on cards & Detail dialog |
| **Metrics Summary** | ✅ Done | Real-time ticket status counts (`Total`, `Pending`, `Accepted`, `Resolved`, `Rejected`) |
| **Toast Notifications** | ✅ Done | Animated floating toasts for feedback on create, update, drag-move & refresh |
| **Responsive Design** | ✅ Done | Modern Vanilla CSS slate/teal theme, adaptive from Desktop to Mobile |

###  Architecture & Best Practices
| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Layered Architecture** | ✅ Done | Separated Domain, Application, Persistence, and Presentation layers |
| **Component Decomposition** | ✅ Done | Modular React components (`Form`, `Board`, `Card`, `Table`, `Dialog`, `Badge`, `Toast`) |

###  Testing, Documentation & DevOps (Bonus / Remarks)
| Extra Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Unit & API Testing** | ✅ Done | Node test runner + Supertest integration tests (`npm test`) |
| **API Specification** | ✅ Done | OpenAPI 3.0 YAML specification (`backend/openapi.yaml`) |
| **Containerization** | ✅ Done | Multi-stage Dockerfiles + `docker-compose.yml` |
| **CI Automation** | ✅ Done | GitHub Actions workflow (`.github/workflows/ci.yml`) |

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

### Testing Ticket Deletion (`DELETE /api/tickets/:id`)

According to the requirement, once a ticket is created, it **cannot be deleted by any means**. Calling `DELETE /api/tickets/:id` will always return `405 Method Not Allowed`.

#### Using cURL:

```bash
curl -i -X DELETE http://localhost:4000/api/tickets/ticket-123
```

Expected Response:

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8

{
  "error": "Tickets are immutable records and cannot be deleted"
}
```

#### Using PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/tickets/ticket-123" -Method Delete
```

#### Using JavaScript `fetch`:

```javascript
const response = await fetch("http://localhost:4000/api/tickets/ticket-123", {
  method: "DELETE"
});

console.log(response.status); // 405
const result = await response.json();
console.log(result); // { error: "Tickets are immutable records and cannot be deleted" }
```

