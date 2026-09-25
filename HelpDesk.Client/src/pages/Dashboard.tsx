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

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [assigningTicket, setAssigningTicket] = useState<number | null>(null);
    const [commentingTicket, setCommentingTicket] = useState<number | null>(null);
    const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        async function loadTickets() {
            try {
                const data = await getTickets();

                setTickets(data);

                if (data.length > 0) {
                    setSelectedTicket(data[0]);
                }
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

    const filteredTickets = tickets.filter((ticket) => {
        const search = searchTerm.toLowerCase();

        return (
            ticket.title.toLowerCase().includes(search) ||
            ticket.id.toString().includes(search) ||
            ticket.createdBy.toLowerCase().includes(search) ||
            (ticket.assignedTo?.toLowerCase().includes(search) ?? false)
        );
    });

    if (loading) {
        return <p>Loading tickets...</p>;
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1>HelpDesk</h1>
                    <span className="dashboard-role">
                        {role}
                    </span>
                </div>

                <div className="dashboard-header-actions">
                    {role === "Employee" && (
                        <button onClick={() => navigate("/create-ticket")}>
                            Create Ticket
                        </button>
                    )}

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Admin section */}
            {role === "Admin" && (
                <div className="admin-section">
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
                                                await updateUserRole(
                                                    user.id,
                                                    event.target.value
                                                );

                                                const data = await getUsers();
                                                setUsers(data);
                                            } catch (error) {
                                                console.error(
                                                    "Failed to update user role:",
                                                    error
                                                );
                                            }
                                        }}
                                    >
                                        <option value="Employee">Employee</option>
                                        <option value="SupportAgent">
                                            SupportAgent
                                        </option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Main ticket area */}
            <div className="ticket-layout">

                {/* Left sidebar */}
                <aside className="ticket-sidebar">
                    <div className="ticket-sidebar-header">
                        <h2>Tickets</h2>
                        <span>{tickets.length}</span>
                    </div>

                    <div className="ticket-search">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    {tickets.length === 0 ? (
                        <p className="empty-tickets">
                            You don't have any tickets yet.
                        </p>
                    ) : (
                        <div className="ticket-list">
                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    type="button"
                                    className={`ticket-list-item ${selectedTicket?.id === ticket.id
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setEditingTicket(null);
                                        setAssigningTicket(null);
                                        setCommentingTicket(null);
                                    }}
                                >
                                    <div className="ticket-list-top">
                                        <span className="ticket-number">
                                            #{ticket.id}
                                        </span>

                                        <span
                                            className={`priority priority-${ticket.priority.toLowerCase()}`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </div>

                                    <h3>{ticket.title}</h3>

                                    <p className="ticket-preview">
                                        {ticket.description}
                                    </p>

                                    <div className="ticket-list-bottom">
                                        <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
                                            {ticket.status}
                                        </span>

                                        <span>
                                            {ticket.assignedTo ?? "Unassigned"}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </aside>

                {/* Main ticket details */}
                <main className="ticket-details">
                    {!selectedTicket ? (
                        <div className="empty-ticket-details">
                            <h2>Select a ticket</h2>
                            <p>
                                Select a ticket from the list to view its details.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="ticket-details-header">
                                <div>
                                    <span className="ticket-id">
                                        Ticket #{selectedTicket.id}
                                    </span>

                                    <h2>{selectedTicket.title}</h2>

                                    <p className="ticket-created">
                                        Created by {selectedTicket.createdBy} ·{" "}
                                        {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <span
                                    className={`status status-${selectedTicket.status.toLowerCase()}`}
                                >
                                    {selectedTicket.status}
                                </span>
                            </div>

                            <div className="ticket-meta">
                                <div>
                                    <span>Priority</span>
                                    <strong>{selectedTicket.priority}</strong>
                                </div>

                                <div>
                                    <span>Created By</span>
                                    <strong>{selectedTicket.createdBy}</strong>
                                </div>

                                <div>
                                    <span>Assigned To</span>
                                    <strong>
                                        {selectedTicket.assignedTo ?? "Not assigned"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Created</span>
                                    <strong>
                                        {new Date(
                                            selectedTicket.createdAt
                                        ).toLocaleString()}
                                    </strong>
                                </div>
                            </div>

                            <section className="ticket-description">
                                <div className="section-heading">
                                    <h3>Description</h3>
                                </div>

                                <p>{selectedTicket.description}</p>
                            </section>

                            <section className="ticket-comments">
                                <div className="section-heading">
                                    <h3>Comments</h3>
                                </div>

                                <CommentsList
                                    ticketId={selectedTicket.id}
                                    refreshKey={commentsRefreshKey}
                                />
                            </section>

                            {/* Ticket actions */}
                            <div className="ticket-actions">
                                {role === "SupportAgent" && (
                                    <button
                                        onClick={() =>
                                            setEditingTicket(selectedTicket)
                                        }
                                    >
                                        Edit Ticket
                                    </button>
                                )}

                                {(role === "SupportAgent" ||
                                    role === "Admin") && (
                                        <button
                                            onClick={() =>
                                                setAssigningTicket(selectedTicket.id)
                                            }
                                        >
                                            Assign Ticket
                                        </button>
                                    )}

                                {(role === "SupportAgent" ||
                                    role === "Admin") && (
                                        <button
                                            onClick={() =>
                                                setCommentingTicket(selectedTicket.id)
                                            }
                                        >
                                            Add Comment
                                        </button>
                                    )}
                            </div>

                            {/* Edit */}
                            {editingTicket?.id === selectedTicket.id && (
                                <div className="ticket-form-panel">
                                    <EditTicketForm
                                        ticket={selectedTicket}
                                        onCancel={() =>
                                            setEditingTicket(null)
                                        }
                                        onSaved={async () => {
                                            setEditingTicket(null);

                                            const data = await getTickets();

                                            setTickets(data);

                                            const updatedTicket = data.find(
                                                (ticket: Ticket) =>
                                                    ticket.id === selectedTicket.id
                                            );

                                            if (updatedTicket) {
                                                setSelectedTicket(updatedTicket);
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Assignment */}
                            {assigningTicket === selectedTicket.id && (
                                <div className="ticket-form-panel">
                                    <AssignTicketForm
                                        ticketId={selectedTicket.id}
                                        onCancel={() =>
                                            setAssigningTicket(null)
                                        }
                                        onAssigned={async () => {
                                            setAssigningTicket(null);

                                            const data = await getTickets();

                                            setTickets(data);

                                            const updatedTicket = data.find(
                                                (ticket: Ticket) =>
                                                    ticket.id === selectedTicket.id
                                            );

                                            if (updatedTicket) {
                                                setSelectedTicket(updatedTicket);
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Comment */}
                            {commentingTicket === selectedTicket.id && (
                                <div className="ticket-form-panel">
                                    <AddCommentForm
                                        ticketId={selectedTicket.id}
                                        onCancel={() =>
                                            setCommentingTicket(null)
                                        }
                                        onAdded={async () => {
                                            setCommentsRefreshKey((key) => key + 1);
                                            setCommentingTicket(null);

                                            const data = await getTickets();

                                            setTickets(data);

                                            const updatedTicket = data.find(
                                                (ticket: Ticket) =>
                                                    ticket.id === selectedTicket.id
                                            );

                                            if (updatedTicket) {
                                                setSelectedTicket(updatedTicket);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;