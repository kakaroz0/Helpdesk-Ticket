const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "Request failed");
  }

  return body.data;
}

export function listTickets(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  return request(`/tickets${query.toString() ? `?${query}` : ""}`);
}

export function createTicket(payload) {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTicket(id, payload) {
  return request(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
