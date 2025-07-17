import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

interface SignUpPageProps {
    adminUsers: any[];
    normalUsers: any[];
    onSignUp: (user: any, role: string) => void;
}

export default function SignUpPage({ adminUsers, normalUsers, onSignUp }: SignUpPageProps) {
    const navigate = useNavigate();
    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        let currentErrors: {[key: string]: string} = {};
        let isValid = true;

        if (!username.trim()) {
            currentErrors.username = "Please enter a username to create your account.";
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(username)) {
            currentErrors.username = "Username must only contain letters (a-z, A-Z).";
            isValid = false;
        }

        if (!email.trim()) {
            currentErrors.email = "Email is required.";
            isValid = false;
        } else if (!validateEmail(email)) {
            currentErrors.email = "Please enter a valid email address (e.g., example@domain.com).";
            isValid = false;
        }

        if (!phoneNumber.trim()) {
            currentErrors.phoneNumber = "Phone number is required.";
            isValid = false;
        } else if (!validatePhone(phoneNumber)) {
            currentErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
            isValid = false;
        }

        if (!password.trim()) {
            currentErrors.password = "Password is required.";
            isValid = false;
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{6,}$/.test(password)) {
            currentErrors.password =
                "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one symbol.";
            isValid = false;
        } else if (password !== confirmPassword) {
            currentErrors.confirmPassword = "Passwords do not match. Please re-enter.";
            isValid = false;
        }

        if (isValid) {
            const users = role === "admin" ? adminUsers : normalUsers;
            const userExists = users.some((u) => u.username === username);
            if (userExists) {
                currentErrors.username = "This username is already taken. Please choose another.";
                isValid = false;
            }
        }

        setErrors(currentErrors);

        if (isValid) {
            const users = role === "admin" ? adminUsers : normalUsers;
            const newId = users.length ? users[users.length - 1].id + 1 : 1;
            const newUser = {
                id: newId,
                username,
                email,
                phone_number: phoneNumber,
                password,
            };
            onSignUp(newUser, role);
            navigate("/login");
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
                <h2>Medvendo Signup</h2>
                <Link to="/" className="back-button-round" aria-label="Go back to homepage">
                    <FaArrowLeft />
                </Link>
                <form onSubmit={handleSignup}>
                    <select
                        onChange={(e) => setRole(e.target.value)}
                        value={role}
                        aria-label="Select user role for signup"
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
                    {errors.username && <p className="error-message" role="alert">{errors.username}</p>}
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email"
                        required
                    />
                    {errors.email && <p className="error-message" role="alert">{errors.email}</p>}
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        aria-label="Phone number"
                        required
                    />
                    {errors.phoneNumber && (
                        <p className="error-message" role="alert">{errors.phoneNumber}</p>
                    )}
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
                    {errors.password && <p className="error-message" role="alert">{errors.password}</p>}
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        aria-label="Confirm password"
                        required
                    />
                    {errors.confirmPassword && (
                        <p className="error-message" role="alert">{errors.confirmPassword}</p>
                    )}
                    <button type="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account?{" "}
                    <Link to="/login" className="link-button">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
