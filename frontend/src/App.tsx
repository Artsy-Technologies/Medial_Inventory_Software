import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";
import "./index.css";

// Initial user data
const INITIAL_ADMIN_USERS = [
    {
        id: 1,
        username: "admin",
        name: "Admin User",
        email: "admin@medvendo.com",
        phone_number: "0000000000",
        password: "123",
    },
];

const INITIAL_NORMAL_USERS = [
    {
        id: 1,
        username: "user",
        name: "Normal User",
        email: "user@medvendo.com",
        phone_number: "1111111111",
        password: "123",
    },
];

// Protected Route Component
const ProtectedRoute = ({ 
    children, 
    currentUser, 
    currentRole, 
    requireAdmin = false 
}: { 
    children: React.ReactNode; 
    currentUser: any; 
    currentRole: string | null; 
    requireAdmin?: boolean; 
}) => {
    if (!currentUser) return <Navigate to="/login" />;
    if (requireAdmin && currentRole !== "admin") return <Navigate to="/" />;
    return <>{children}</>;
};

function App() {
    const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
    const [normalUsers, setNormalUsers] = useState(INITIAL_NORMAL_USERS);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentRole, setCurrentRole] = useState<string | null>(null);

    // Load user from localStorage on app start
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("currentUser");
            const storedRole = localStorage.getItem("currentRole");
            if (storedUser && storedRole) {
                setCurrentUser(JSON.parse(storedUser));
                setCurrentRole(storedRole);
            }
        } catch (error) {
            console.error("Failed to load user from localStorage:", error);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("currentRole");
        }
    }, []);

    // Handle user login
    const handleLogin = (user: any, role: string) => {
        setCurrentUser(user);
        setCurrentRole(role);
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("currentRole", role);
    };

    // Handle user signup
    const handleSignup = (newUser: any, role: string) => {
        if (role === "admin") {
            setAdminUsers((prevUsers) => [...prevUsers, newUser]);
        } else {
            setNormalUsers((prevUsers) => [...prevUsers, newUser]);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentRole(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentRole");
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                
                <Route
                    path="/login"
                    element={
                        currentUser ? (
                            <Navigate to={`/${currentRole}`} replace />
                        ) : (
                            <LoginPage
                                adminUsers={adminUsers}
                                normalUsers={normalUsers}
                                onLogin={handleLogin}
                            />
                        )
                    }
                />
                
                <Route
                    path="/signup"
                    element={
                        currentUser ? (
                            <Navigate to={`/${currentRole}`} replace />
                        ) : (
                            <SignUpPage
                                adminUsers={adminUsers}
                                normalUsers={normalUsers}
                                onSignUp={handleSignup}
                            />
                        )
                    }
                />
                
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute 
                            currentUser={currentUser} 
                            currentRole={currentRole} 
                            requireAdmin
                        >
                            <AdminDashboard
                                onLogout={handleLogout}
                                currentUser={currentUser}
                            />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute 
                            currentUser={currentUser} 
                            currentRole={currentRole}
                        >
                            <UserDashboard
                                onLogout={handleLogout}
                                currentUser={currentUser}
                            />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

createRoot(document.getElementById("root")!).render(<App />);
export default App;
