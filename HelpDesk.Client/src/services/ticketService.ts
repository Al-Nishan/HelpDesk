import { apiRequest } from "./api";

export async function getTickets() {
  return apiRequest("/api/Tickets");
}

export async function updateTicket(
  id: number,
  title: string,
  description: string,
  status: string,
  priority: string
) {
  return apiRequest(`/api/Tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
    }),
  });
}

export async function assignTicket(
  id: number,
  assignedTo: string
) {
  return apiRequest(`/api/Tickets/${id}/assign`, {
    method: "PUT",
    body: JSON.stringify({
      assignedTo,
    }),
  });
}

export async function addComment(
  ticketId: number,
  comment: string
) {
  return apiRequest(`/api/Tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      comment,
    }),
  });
}

export async function getComments(ticketId: number) {
  return apiRequest(`/api/Tickets/${ticketId}/comments`);
}