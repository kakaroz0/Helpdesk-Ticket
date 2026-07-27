import { X } from "lucide-react";
import { TicketForm } from "./TicketForm.jsx";

export function EditTicketDialog({ ticket, onClose, onSubmit, isSaving }) {
  if (!ticket) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="edit-ticket-title">
        <header>
          <div>
            <p>Edit support ticket</p>
            <h2 id="edit-ticket-title">{ticket.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </header>
        <TicketForm mode="edit" initialTicket={ticket} onSubmit={onSubmit} onCancel={onClose} isSaving={isSaving} />
      </section>
    </div>
  );
}
