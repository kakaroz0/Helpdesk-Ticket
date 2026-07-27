import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class JsonTicketRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.writeQueue = Promise.resolve();
  }

  async create(ticket) {
    const tickets = await this.findAll();
    tickets.push(ticket);
    await this.persist(tickets);
    return ticket;
  }

  async findAll() {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async findById(id) {
    const tickets = await this.findAll();
    return tickets.find((ticket) => ticket.id === id) || null;
  }

  async update(id, changes) {
    const tickets = await this.findAll();
    const index = tickets.findIndex((ticket) => ticket.id === id);
    if (index === -1) {
      return null;
    }

    tickets[index] = { ...tickets[index], ...changes };
    await this.persist(tickets);
    return tickets[index];
  }

  async persist(tickets) {
    this.writeQueue = this.writeQueue.then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      await writeFile(this.filePath, JSON.stringify(tickets, null, 2));
    });

    return this.writeQueue;
  }
}
