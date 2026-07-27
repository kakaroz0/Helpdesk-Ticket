import cors from "cors";
import express from "express";
import morgan from "morgan";
import { TicketService } from "./application/ticketService.js";
import { errorHandler } from "./presentation/errorHandler.js";
import { createTicketRouter } from "./presentation/ticketRoutes.js";

export function createApp(ticketRepository) {
  const app = express();
  const ticketService = new TicketService(ticketRepository);

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/tickets", createTicketRouter(ticketService));
  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
  app.use(errorHandler);

  return app;
}
