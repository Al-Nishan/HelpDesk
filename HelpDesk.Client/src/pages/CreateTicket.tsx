import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function CreateTicket() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <h1>Create Ticket</h1>

            <button type="button" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>

            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    try {
                        setLoading(true);

                        await apiRequest("/api/Tickets", {
                            method: "POST",
                            body: JSON.stringify({
                                title,
                                description,
                                priority,
                            }),
                        });

                        navigate("/dashboard");
                    } catch (error) {
                        console.error("Failed to create ticket:", error);
                        alert("Failed to create ticket.");
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <div>
                    <label>Title</label>
                    <br />
                    <input
                        type="text"
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
                    <label>Priority</label>
                    <br />
                    <select
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Ticket"}
                </button>
            </form>
        </div>
    );
}

export default CreateTicket;