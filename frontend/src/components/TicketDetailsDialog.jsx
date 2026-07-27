import { CalendarClock, Clock3, Mail, X } from "lucide-react";
import { STATUS_LABELS } from "../constants.js";
import { formatDateTime } from "../utils/date.js";
import { StatusBadge } from "./StatusBadge.jsx";

export function TicketDetailsDialog({ ticket, onClose }) {
  if (!ticket) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog ticket-details-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>Ticket details</p>
            <h2 id="ticket-details-title">{ticket.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close ticket details" title="Close">
            <X size={18} />
          </button>
        </header>

        <div className="ticket-details__status">
          <StatusBadge status={ticket.status} />
          <span>{STATUS_LABELS[ticket.status]}</span>
        </div>
        <div className="ticket-details__description">{ticket.description}</div>
        <dl className="ticket-details__facts">
          <div>
            <dt><Mail size={15} /> Contact</dt>
            <dd>{ticket.contactInformation}</dd>
          </div>
          <div>
            <dt><CalendarClock size={15} /> Created</dt>
            <dd>{formatDateTime(ticket.createdAt)}</dd>
          </div>
          <div>
            <dt><Clock3 size={15} /> Latest update</dt>
            <dd>{formatDateTime(ticket.updatedAt)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
