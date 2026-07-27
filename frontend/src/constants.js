export const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    tone: "amber",
    description: "New requests waiting for triage"
  },
  {
    value: "accepted",
    label: "Accepted",
    tone: "blue",
    description: "Tickets currently being handled"
  },
  {
    value: "resolved",
    label: "Resolved",
    tone: "green",
    description: "Completed support work"
  },
  {
    value: "rejected",
    label: "Rejected",
    tone: "red",
    description: "Requests declined with reason"
  }
];

export const STATUS_LABELS = Object.fromEntries(STATUSES.map((status) => [status.value, status.label]));
