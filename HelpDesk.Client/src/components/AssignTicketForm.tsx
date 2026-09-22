import { useState } from "react";
import { assignTicket } from "../services/ticketService";

interface AssignTicketFormProps {
  ticketId: number;
  onAssigned: () => void;
  onCancel: () => void;
}

function AssignTicketForm({
  ticketId,
  onAssigned,
  onCancel,
}: AssignTicketFormProps) {
  const [assignedTo, setAssignedTo] = useState("");

  return (
    <div>
      <h4>Assign Ticket</h4>

      <label>Support Agent Username</label>
      <br />

      <input
        type="text"
        value={assignedTo}
        onChange={(event) => setAssignedTo(event.target.value)}
        placeholder="Enter username"
      />

      <br />
      <br />

      <button
        type="button"
        onClick={async () => {
          try {
            await assignTicket(ticketId, assignedTo);
            onAssigned();
          } catch (error) {
            console.error("Failed to assign ticket:", error);
            alert("Failed to assign ticket.");
          }
        }}
      >
        Assign
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AssignTicketForm;