import { STATUSES } from "../constants.js";
import { TicketCard } from "./TicketCard.jsx";

export function KanbanBoard({ tickets, onView, onEdit, onMoveTicket }) {
  function handleDragStart(event, ticketId) {
    event.dataTransfer.setData("text/plain", ticketId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(event, status) {
    event.preventDefault();
    const ticketId = event.dataTransfer.getData("text/plain");
    if (ticketId) {
      onMoveTicket(ticketId, status);
    }
  }

  return (
    <section className="board" aria-label="Ticket status board">
      {STATUSES.map((status) => {
        const columnTickets = tickets.filter((ticket) => ticket.status === status.value);

        return (
          <div
            className={`board-column board-column--${status.tone}`}
            key={status.value}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, status.value)}
          >
            <header>
              <div>
                <h2>{status.label}</h2>
                <p>{status.description}</p>
              </div>
              <span>{columnTickets.length}</span>
            </header>
            <div className="board-column__tickets">
              {columnTickets.length ? (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onView={onView}
                    onEdit={onEdit}
                    onDragStart={handleDragStart}
                    onMoveTicket={onMoveTicket}
                  />
                ))
              ) : (
                <div className="empty-column">No tickets in this status</div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
