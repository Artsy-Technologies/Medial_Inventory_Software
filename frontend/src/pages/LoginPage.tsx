import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginPageProps {
    adminUsers: any[];
    normalUsers: any[];
    onLogin: (user: any, role: string) => void;
}

export default function LoginPage({ adminUsers, normalUsers, onLogin }: LoginPageProps) {
    const navigate = useNavigate();
    const [role, setRole] = useState("admin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password.");
            return;
        }

        const usernameRegex = /^[a-zA-Z]+$/;
        if (!usernameRegex.test(username)) {
            setError("Username must only contain letters (a-z, A-Z).");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{6,}$/;
        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one symbol."
            );
            return;
        }

        setError("");

        const users = role === "admin" ? adminUsers : normalUsers;
        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );

        if (foundUser) {
            onLogin(foundUser, role);
            navigate(`/${role}`);
        } else {
            setError("Incorrect username or password. Please double-check your credentials.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-box smaller-form">
                <img
                    src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                    alt="Medvendo Logo"
                    className="form-logo"
                />
                <h2>Medvendo Login</h2>
                <Link to="/" className="back-button-round" aria-label="Go back to homepage">
                    <FaArrowLeft />
                </Link>
                {error && <p className="error-message" role="alert">{error}</p>}
                <form onSubmit={handleLogin}>
                    <select
                        onChange={(e) => setRole(e.target.value)}
                        value={role}
                        aria-label="Select user role"
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-label="Username"
                        required
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Password"
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            role="button"
                            tabIndex={0}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-button">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
