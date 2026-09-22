import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div>
            <h1>Login</h1>

            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    try {
                        const data = await login(username, password);
                        localStorage.setItem("token", data.token);

                        navigate("/dashboard");
                    } catch (error) {
                        console.error("Login failed:", error);
                    }
                }}
            >
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;