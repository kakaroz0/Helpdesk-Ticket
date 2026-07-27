export class MemoryTicketRepository {
  constructor(seed = []) {
    this.tickets = [...seed];
  }

  async create(ticket) {
    this.tickets.push(ticket);
    return ticket;
  }

  async findAll() {
    return [...this.tickets];
  }

  async findById(id) {
    return this.tickets.find((ticket) => ticket.id === id) || null;
  }

  async update(id, changes) {
    const index = this.tickets.findIndex((ticket) => ticket.id === id);
    if (index === -1) {
      return null;
    }

    this.tickets[index] = { ...this.tickets[index], ...changes };
    return this.tickets[index];
  }
}
