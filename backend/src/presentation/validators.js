import { z } from "zod";
import { TICKET_STATUSES } from "../domain/ticket.js";

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  contactInformation: z.string().trim().min(3).max(160)
});

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().min(10).max(2000).optional(),
    contactInformation: z.string().trim().min(3).max(160).optional(),
    status: z.enum(TICKET_STATUSES).optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided"
  });

export const listTicketSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  sortBy: z.enum(["status", "createdAt", "updatedAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional()
});
