import { ArrowDownAZ, ArrowUpAZ, Eye, Pencil, Search, X } from "lucide-react";
import { STATUSES } from "../constants.js";
import { formatDateTime } from "../utils/date.js";
import { StatusBadge } from "./StatusBadge.jsx";

export function TicketTable({ tickets, filters, searchQuery, onSearchChange, onFilterChange, onView, onEdit }) {
  const SortIcon = filters.sortDirection === "asc" ? ArrowUpAZ : ArrowDownAZ;

  return (
    <section className="ticket-table-section">
      <div className="table-toolbar">
        <div>
          <h2>Ticket register</h2>
          <p>{tickets.length} visible tickets</p>
        </div>
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input
              type="text"
              placeholder="Search title, description, contact..."
              value={searchQuery || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search tickets"
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-bar__clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            ) : null}
          </div>
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(event) => onFilterChange({ ...filters, status: event.target.value })}
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort by"
            value={filters.sortBy}
            onChange={(event) => onFilterChange({ ...filters, sortBy: event.target.value })}
          >
            <option value="updatedAt">Latest update</option>
            <option value="createdAt">Created time</option>
            <option value="status">Status</option>
          </select>
          <button
            className="button button--secondary"
            type="button"
            onClick={() =>
              onFilterChange({
                ...filters,
                sortDirection: filters.sortDirection === "asc" ? "desc" : "asc"
              })
            }
          >
            <SortIcon size={18} />
            {filters.sortDirection}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Created</th>
              <th>Updated</th>
              <th aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {tickets.length ? (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <strong>{ticket.title}</strong>
                    <span>{ticket.description}</span>
                  </td>
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td>{ticket.contactInformation}</td>
                  <td>{formatDateTime(ticket.createdAt)}</td>
                  <td>{formatDateTime(ticket.updatedAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button" onClick={() => onView(ticket)} aria-label={`View ${ticket.title}`} title="View ticket">
                        <Eye size={16} />
                      </button>
                      <button className="icon-button" onClick={() => onEdit(ticket)} aria-label={`Edit ${ticket.title}`} title="Edit ticket">
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-table" colSpan="6">
                  No tickets match the current view
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
