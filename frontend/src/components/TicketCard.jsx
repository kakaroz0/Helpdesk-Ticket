import { Eye, Mail, Pencil, Timer } from "lucide-react";
import { STATUSES } from "../constants.js";
import { formatDateTime, relativeAge } from "../utils/date.js";
import { StatusBadge } from "./StatusBadge.jsx";

export function TicketCard({ ticket, onView, onEdit, onDragStart, onMoveTicket }) {
  const nextStatuses = STATUSES.filter((status) => status.value !== ticket.status);

  return (
    <article
      className="ticket-card"
      draggable
      onDragStart={(event) => onDragStart(event, ticket.id)}
      aria-label={`${ticket.title} ticket`}
    >
      <div className="ticket-card__topline">
        <StatusBadge status={ticket.status} />
        <span className="ticket-card__age">
          <Timer size={14} />
          {relativeAge(ticket.updatedAt)}
        </span>
      </div>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <div className="ticket-card__meta">
        <span>
          <Mail size={14} />
          {ticket.contactInformation}
        </span>
        <div className="ticket-card__tools">
          <button className="icon-button" onClick={() => onView(ticket)} aria-label={`View ${ticket.title}`} title="View ticket">
            <Eye size={16} />
          </button>
          <button className="icon-button" onClick={() => onEdit(ticket)} aria-label={`Edit ${ticket.title}`} title="Edit ticket">
            <Pencil size={16} />
          </button>
        </div>
      </div>
      <div className="ticket-card__actions" aria-label="Quick status actions">
        {nextStatuses.map((status) => (
          <button
            className={`quick-status quick-status--${status.tone}`}
            key={status.value}
            type="button"
            onClick={() => onMoveTicket(ticket.id, status.value)}
          >
            {status.label}
          </button>
        ))}
      </div>
      <time dateTime={ticket.updatedAt}>Updated {formatDateTime(ticket.updatedAt)}</time>
    </article>
  );
}
