import { useState } from "react";
import type { Ticket } from "../types/Ticket";
import { updateTicket } from "../services/ticketService";

interface EditTicketFormProps {
    ticket: Ticket;
    onCancel: () => void;
    onSaved: () => void;
}

function EditTicketForm({
    ticket,
    onCancel,
    onSaved,
}: EditTicketFormProps) {
    const [title, setTitle] = useState(ticket.title);
    const [description, setDescription] = useState(ticket.description);
    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);

    return (
        <div>
            <h4>Edit Ticket</h4>

            <div>
                <label>Title</label>
                <br />
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div>
                <label>Description</label>
                <br />
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div>
                <label>Status</label>
                <br />
                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as Ticket["status"])
                    }
                >
                    <option value="Open">Open</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div>
                <label>Priority</label>
                <br />
                <select
                    value={priority}
                    onChange={(event) =>
                        setPriority(event.target.value as Ticket["priority"])
                    }
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>

            <button
                type="button"
                onClick={async () => {
                    try {
                        await updateTicket(
                            ticket.id,
                            title,
                            description,
                            status,
                            priority
                        );

                        onSaved();
                    } catch (error) {
                        console.error("Failed to update ticket:", error);
                        alert("Failed to update ticket.");
                    }
                }}
            >
                Save
            </button>

            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}

export default EditTicketForm;