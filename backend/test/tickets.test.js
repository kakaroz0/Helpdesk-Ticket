import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import { createApp } from "../src/app.js";
import { MemoryTicketRepository } from "../src/persistence/memoryTicketRepository.js";

function buildApp(seed = []) {
  return createApp(new MemoryTicketRepository(seed));
}

test("creates a ticket with timestamps and pending status", async () => {
  const app = buildApp();

  const response = await request(app).post("/api/tickets").send({
    title: "Cannot login",
    description: "The customer cannot login after password reset.",
    contactInformation: "alex@example.com"
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.status, "pending");
  assert.ok(response.body.data.id);
  assert.ok(response.body.data.createdAt);
  assert.ok(response.body.data.updatedAt);
});

test("updates editable fields and status", async () => {
  const app = buildApp([
    {
      id: "ticket-1",
      title: "Printer problem",
      description: "Office printer queue is stuck.",
      contactInformation: "ops@example.com",
      status: "pending",
      createdAt: "2026-07-27T08:00:00.000Z",
      updatedAt: "2026-07-27T08:00:00.000Z"
    }
  ]);

  const response = await request(app).patch("/api/tickets/ticket-1").send({
    status: "accepted",
    title: "Printer queue problem"
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, "accepted");
  assert.equal(response.body.data.title, "Printer queue problem");
  assert.notEqual(response.body.data.updatedAt, "2026-07-27T08:00:00.000Z");
});

test("filters by status and sorts by latest update", async () => {
  const app = buildApp([
    {
      id: "old",
      title: "Old pending",
      description: "Pending ticket with older update.",
      contactInformation: "old@example.com",
      status: "pending",
      createdAt: "2026-07-27T07:00:00.000Z",
      updatedAt: "2026-07-27T07:00:00.000Z"
    },
    {
      id: "new",
      title: "New pending",
      description: "Pending ticket with newer update.",
      contactInformation: "new@example.com",
      status: "pending",
      createdAt: "2026-07-27T08:00:00.000Z",
      updatedAt: "2026-07-27T09:00:00.000Z"
    },
    {
      id: "resolved",
      title: "Resolved case",
      description: "This should be filtered out.",
      contactInformation: "done@example.com",
      status: "resolved",
      createdAt: "2026-07-27T08:00:00.000Z",
      updatedAt: "2026-07-27T10:00:00.000Z"
    }
  ]);

  const response = await request(app).get("/api/tickets?status=pending&sortBy=updatedAt&sortDirection=desc");

  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.data.map((ticket) => ticket.id),
    ["new", "old"]
  );
});

test("does not allow ticket deletion", async () => {
  const app = buildApp([
    {
      id: "ticket-1",
      title: "Keep me",
      description: "Tickets cannot be deleted.",
      contactInformation: "audit@example.com",
      status: "pending",
      createdAt: "2026-07-27T08:00:00.000Z",
      updatedAt: "2026-07-27T08:00:00.000Z"
    }
  ]);

  const response = await request(app).delete("/api/tickets/ticket-1");

  assert.equal(response.status, 405);
});

test("rejects invalid ticket creation payloads", async () => {
  const app = buildApp();

  const response = await request(app).post("/api/tickets").send({
    title: "No",
    description: "Too short",
    contactInformation: ""
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Validation failed");
  assert.ok(response.body.details.length >= 1);
});

test("rejects invalid status updates", async () => {
  const app = buildApp([
    {
      id: "ticket-1",
      title: "Status check",
      description: "Ticket used to verify invalid status validation.",
      contactInformation: "qa@example.com",
      status: "pending",
      createdAt: "2026-07-27T08:00:00.000Z",
      updatedAt: "2026-07-27T08:00:00.000Z"
    }
  ]);

  const response = await request(app).patch("/api/tickets/ticket-1").send({
    status: "closed"
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Validation failed");
});
