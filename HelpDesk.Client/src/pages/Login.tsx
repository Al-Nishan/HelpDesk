import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>HelpDesk</h1>
                <p className="login-subtitle">Sign in to your account</p>

                <form
                    onSubmit={async (event) => {
                        event.preventDefault();

                        try {
                            const data = await login(username, password);

                            localStorage.setItem("token", data.token);

                            navigate("/dashboard");
                        } catch (error) {
                            console.error("Login failed:", error);
                            alert("Invalid username or password.");
                        }
                    }}
                >
                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;