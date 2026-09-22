import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import type { Ticket } from "../types/Ticket";
import { getUserRole } from "../services/authUtils";
import { getUsers, updateUserRole } from "../services/userService";
import EditTicketForm from "../components/EditTicketForm";
import AssignTicketForm from "../components/AssignTicketForm";
import AddCommentForm from "../components/AddCommentForm";
import CommentsList from "../components/CommentsList";

function Dashboard() {

    const navigate = useNavigate();

    const role = getUserRole();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [assigningTicket, setAssigningTicket] = useState<number | null>(null);
    const [commentingTicket, setCommentingTicket] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function loadTickets() {
            try {
                const data = await getTickets();
                setTickets(data);
            } catch (error) {
                console.error("Failed to load tickets:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTickets();
    }, []);

    useEffect(() => {
        if (role !== "Admin") {
            return;
        }

        async function loadUsers() {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        }

        loadUsers();
    }, [role]);

    if (loading) {
        return <p>Loading tickets...</p>;
    }

    return (
        <div>
            <h1>HelpDesk Dashboard</h1>

            <p>
                <strong>Role:</strong> {role}
            </p>

            {role === "Employee" && (
                <button onClick={() => navigate("/create-ticket")}>
                    Create Ticket
                </button>
            )}

            {role === "SupportAgent" && (
                <p>
                    Support Agent Dashboard
                </p>
            )}

            {role === "Admin" && (
                <div>
                    <h2>Admin Dashboard</h2>

                    <h3>Users</h3>

                    {users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    <strong>{user.userName}</strong>

                                    <select
                                        value={user.roles[0] ?? "Employee"}
                                        onChange={async (event) => {
                                            try {
                                                await updateUserRole(user.id, event.target.value);

                                                const data = await getUsers();
                                                setUsers(data);
                                            } catch (error) {
                                                console.error("Failed to update user role:", error);
                                            }
                                        }}
                                    >
                                        <option value="Employee">Employee</option>
                                        <option value="SupportAgent">SupportAgent</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>

            <h2>Tickets</h2>

            {tickets.length === 0 ? (
                <p>You don't have any tickets yet.</p>) : (
                <div>
                    {tickets.map((ticket) => (
                        <div className="ticket-card" key={ticket.id}>
                            <h3>{ticket.title}</h3>

                            <p>{ticket.description}</p>

                            <p>
                                <strong>Status:</strong> {ticket.status}
                            </p>

                            <p>
                                <strong>Priority:</strong> {ticket.priority}
                            </p>

                            <p>
                                <strong>Created By:</strong> {ticket.createdBy}
                            </p>

                            <p>
                                <strong>Assigned To:</strong>{" "}
                                {ticket.assignedTo ?? "Not assigned"}
                            </p>

                            <CommentsList ticketId={ticket.id} />

                            {role === "SupportAgent" && (
                                <button onClick={() => setEditingTicket(ticket)}>
                                    Edit Ticket
                                </button>
                            )}

                            <button onClick={() => setAssigningTicket(ticket.id)}>
                                Assign Ticket
                            </button>

                            <button onClick={() => setCommentingTicket(ticket.id)}>
                                Add Comment
                            </button>

                            {commentingTicket === ticket.id && (
                                <AddCommentForm
                                    ticketId={ticket.id}
                                    onCancel={() => setCommentingTicket(null)}
                                    onAdded={async () => {
                                        setCommentingTicket(null);

                                        const data = await getTickets();
                                        setTickets(data);
                                    }}
                                />
                            )}

                            {assigningTicket === ticket.id && (
                                <AssignTicketForm
                                    ticketId={ticket.id}
                                    onCancel={() => setAssigningTicket(null)}
                                    onAssigned={async () => {
                                        setAssigningTicket(null);

                                        const data = await getTickets();
                                        setTickets(data);
                                    }}
                                />
                            )}

                            {editingTicket?.id === ticket.id && (
                                <EditTicketForm
                                    ticket={ticket}
                                    onCancel={() => setEditingTicket(null)}
                                    onSaved={async () => {
                                        setEditingTicket(null);

                                        const data = await getTickets();
                                        setTickets(data);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;