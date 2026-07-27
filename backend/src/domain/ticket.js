export const TICKET_STATUSES = ["pending", "accepted", "resolved", "rejected"];

export function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

export function isTicketStatus(status) {
  return TICKET_STATUSES.includes(normalizeStatus(status));
}
