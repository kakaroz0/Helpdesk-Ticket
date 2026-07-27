import { randomUUID } from "node:crypto";
import { TICKET_STATUSES, normalizeStatus } from "../domain/ticket.js";

export class TicketService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async createTicket(payload) {
    const now = new Date().toISOString();
    const ticket = {
      id: randomUUID(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      contactInformation: payload.contactInformation.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now
    };

    return this.ticketRepository.create(ticket);
  }

  async listTickets({ status, sortBy = "updatedAt", sortDirection = "desc" } = {}) {
    const tickets = await this.ticketRepository.findAll();
    const normalizedStatus = status ? normalizeStatus(status) : null;
    const direction = sortDirection === "asc" ? 1 : -1;

    return tickets
      .filter((ticket) => !normalizedStatus || ticket.status === normalizedStatus)
      .sort((a, b) => {
        if (sortBy === "status") {
          return direction * (TICKET_STATUSES.indexOf(a.status) - TICKET_STATUSES.indexOf(b.status));
        }

        const left = sortBy === "createdAt" ? a.createdAt : a.updatedAt;
        const right = sortBy === "createdAt" ? b.createdAt : b.updatedAt;
        return direction * left.localeCompare(right);
      });
  }

  async getTicket(id) {
    return this.ticketRepository.findById(id);
  }

  async updateTicket(id, payload) {
    const current = await this.ticketRepository.findById(id);
    if (!current) {
      return null;
    }

    const changes = {};
    for (const key of ["title", "description", "contactInformation"]) {
      if (payload[key] !== undefined) {
        changes[key] = payload[key].trim();
      }
    }

    if (payload.status !== undefined) {
      changes.status = normalizeStatus(payload.status);
    }

    changes.updatedAt = new Date().toISOString();
    return this.ticketRepository.update(id, changes);
  }
}
