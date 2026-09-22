export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "Open" | "InProgress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
}