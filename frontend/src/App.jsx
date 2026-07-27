import { AlertCircle, Headphones, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KanbanBoard } from "./components/KanbanBoard.jsx";
import { EditTicketDialog } from "./components/EditTicketDialog.jsx";
import { TicketDetailsDialog } from "./components/TicketDetailsDialog.jsx";
import { TicketForm } from "./components/TicketForm.jsx";
import { TicketTable } from "./components/TicketTable.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import { STATUS_LABELS } from "./constants.js";
import { createTicket, listTickets, updateTicket } from "./services/api.js";

const defaultFilters = {
  status: "",
  sortBy: "updatedAt",
  sortDirection: "desc"
};

export function App() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadTickets = useCallback(async (isManualRefresh = false) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await listTickets(filters);
      setTickets(data);
      if (isManualRefresh) {
        addToast("Ticket list refreshed", "info");
      }
    } catch (requestError) {
      setError(requestError.message);
      addToast(requestError.message || "Failed to load tickets", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase().trim();
    return tickets.filter(
      (ticket) =>
        ticket.title?.toLowerCase().includes(q) ||
        ticket.description?.toLowerCase().includes(q) ||
        ticket.contactInformation?.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  const counts = useMemo(
    () =>
      tickets.reduce(
        (summary, ticket) => ({
          ...summary,
          [ticket.status]: (summary[ticket.status] || 0) + 1
        }),
        {}
      ),
    [tickets]
  );

  async function handleCreate(payload) {
    setIsSaving(true);
    setError("");
    try {
      await createTicket(payload);
      addToast("Ticket created successfully!", "success");
      await loadTickets();
    } catch (requestError) {
      setError(requestError.message);
      addToast(requestError.message || "Failed to create ticket", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setIsSaving(true);
    setError("");
    try {
      await updateTicket(editingTicket.id, payload);
      setEditingTicket(null);
      addToast("Ticket updated successfully!", "success");
      await loadTickets();
    } catch (requestError) {
      setError(requestError.message);
      addToast(requestError.message || "Failed to update ticket", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMoveTicket(ticketId, status) {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket || ticket.status === status) {
      return;
    }

    const statusName = STATUS_LABELS[status] || status;
    setError("");
    setTickets((current) => current.map((item) => (item.id === ticketId ? { ...item, status } : item)));
    try {
      await updateTicket(ticketId, { status });
      addToast(`Ticket status changed to "${statusName}"`, "success");
      await loadTickets();
    } catch (requestError) {
      setError(requestError.message);
      addToast(requestError.message || "Failed to update status", "error");
      await loadTickets();
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          <Headphones size={28} />
        </div>
        <div>
          <p>Helpdesk</p>
          <h1>Support ticket operations</h1>
        </div>
        <button className="button button--secondary" type="button" onClick={() => loadTickets(true)}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </header>

      {error ? (
        <div className="notice" role="alert">
          <AlertCircle size={18} />
          {error}
        </div>
      ) : null}

      <section className="summary-strip" aria-label="Ticket summary">
        <div>
          <span>Total</span>
          <strong>{tickets.length}</strong>
        </div>
        <div>
          <span>Pending</span>
          <strong>{counts.pending || 0}</strong>
        </div>
        <div>
          <span>Accepted</span>
          <strong>{counts.accepted || 0}</strong>
        </div>
        <div>
          <span>Resolved</span>
          <strong>{counts.resolved || 0}</strong>
        </div>
        <div>
          <span>Rejected</span>
          <strong>{counts.rejected || 0}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="create-panel">
          <div className="section-title">
            <p>Intake</p>
            <h2>New ticket</h2>
          </div>
          <TicketForm onSubmit={handleCreate} isSaving={isSaving} />
        </aside>

        <div className="board-region">
          {isLoading ? <div className="loading-panel">Loading tickets...</div> : null}
          {!isLoading && tickets.length === 0 ? (
            <div className="empty-board">
              <h2>No tickets yet</h2>
              <p>Create the first support ticket from the intake form.</p>
            </div>
          ) : null}
          <KanbanBoard tickets={filteredTickets} onView={setViewingTicket} onEdit={setEditingTicket} onMoveTicket={handleMoveTicket} />
        </div>
      </section>

      <TicketTable
        tickets={filteredTickets}
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        onView={setViewingTicket}
        onEdit={setEditingTicket}
      />

      <TicketDetailsDialog ticket={viewingTicket} onClose={() => setViewingTicket(null)} />

      <EditTicketDialog
        ticket={editingTicket}
        onClose={() => setEditingTicket(null)}
        onSubmit={handleUpdate}
        isSaving={isSaving}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </main>
  );
}
