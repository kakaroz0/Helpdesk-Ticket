import { Router } from "express";
import { createTicketSchema, listTicketSchema, updateTicketSchema } from "./validators.js";

export function createTicketRouter(ticketService) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const query = listTicketSchema.parse(req.query);
      const tickets = await ticketService.listTickets(query);
      res.json({ data: tickets });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = createTicketSchema.parse(req.body);
      const ticket = await ticketService.createTicket(payload);
      res.status(201).json({ data: ticket });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const ticket = await ticketService.getTicket(req.params.id);
      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      res.json({ data: ticket });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const payload = updateTicketSchema.parse(req.body);
      const ticket = await ticketService.updateTicket(req.params.id, payload);
      if (!ticket) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      res.json({ data: ticket });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", (_req, res) => {
    res.status(405).json({ error: "Tickets are immutable records and cannot be deleted" });
  });

  return router;
}
