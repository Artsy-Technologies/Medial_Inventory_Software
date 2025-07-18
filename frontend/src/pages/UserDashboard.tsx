import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaDownload, FaUpload } from "react-icons/fa";
import { userMenu } from "../../config/sidebarMenus";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line
} from 'recharts';

interface UserDashboardProps {
    onLogout: () => void;
    currentUser: any;
}

// Dynamic Form Component
const DynamicForm = ({ formTitle, fields }: { formTitle: string; fields: string[] }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadCsv = () => {
        const dummyData = [
            ["Header1", "Header2", "Header3"],
            ["Data1A", "Data1B", "Data1C"],
            ["Data2A", "Data2B", "Data2C"],
        ];

        const csvContent = dummyData.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${formTitle.replace(/\s/g, '_')}_data.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert("Your browser does not support automatic CSV download. Please save the content manually.");
            console.log(csvContent);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file for upload:", file.name, file);
            alert(`File "${file.name}" selected for upload. In a real app, this would be processed.`);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className="form-container">
            <h2>{formTitle}</h2>
            <div className="csv-buttons">
                <button type="button" className="download-btn" onClick={handleDownloadCsv}>
                    <FaDownload /> Download CSV
                </button>
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button type="button" className="upload-btn" onClick={handleUploadClick}>
                    <FaUpload /> Upload CSV
                </button>
            </div>
            <form className="dynamic-form">
                {fields.map((field, index) => (
                    <div className="form-group" key={index}>
                        <label htmlFor={`field-${index}`}>{field}:</label>
                        <input
                            id={`field-${index}`}
                            type="text"
                            placeholder={`Enter ${field.toLowerCase()}`}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

// User Dashboard Home Component
const UserDashboardHome = () => {
    const lowStockData = [
        { name: 'Item A', value: 10 },
        { name: 'Item B', value: 5 },
        { name: 'Item C', value: 12 },
        { name: 'Item D', value: 8 },
    ];
    const orderItemsData = [
        { name: 'Item X', value: 20 },
        { name: 'Item Y', value: 15 },
        { name: 'Item Z', value: 25 },
    ];
    const stockMovementData = [
        { name: 'Jan', movements: 40 },
        { name: 'Feb', movements: 55 },
        { name: 'Mar', movements: 70 },
        { name: 'Apr', movements: 60 },
        { name: 'May', movements: 85 },
        { name: 'Jun', movements: 90 },
    ];

    return (
        <div className="dashboard-home">
            <h2>User Dashboard Overview</h2>
            <p>Here you will see key statistics and information relevant to your role.</p>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Items Running Low</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={lowStockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#007bff" name="Current Stock" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="stat-card">
                    <h3>Items to Order</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={orderItemsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#28a745" name="Quantity to Order" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="stat-card">
                    <h3>Recent Stock Movements</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stockMovementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="movements" stroke="#ffc107" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default function UserDashboard({ onLogout, currentUser }: UserDashboardProps) {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleLogoutAndRedirect = () => {
        onLogout();
        navigate("/");
    };

    const currentActiveMenuItem = userMenu.find(item => item.key === activeMenu);
    const formFieldsToRender = currentActiveMenuItem ? currentActiveMenuItem.fields : [];

    return (
        <div className="dashboard-container">
            {/* Top Info Bar */}
            <div className="top-info-bar">
                <div className="info-left">
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                        alt="Medvendo Logo"
                        className="top-bar-logo"
                    />
                    <span className="company-name">Medvendo</span>
                </div>
                <div className="info-right">
                    <span className="welcome-message">
                        Welcome, <strong>{currentUser.name || currentUser.username}</strong>
                    </span>
                    <button className="logout-btn" onClick={handleLogoutAndRedirect}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="main-nav">
                <div className="dashboard-header">
                    <span className="dashboard-title">User Dashboard</span>
                </div>
            </nav>

            {/* Dashboard Main Content Area */}
            <div className="dashboard-main">
                <aside className="sidebar">
                    <h3>
                        <FaUser /> User Options
                    </h3>
                    <ul>
                        {userMenu.map(({ key, label, description }) => (
                            <li
                                key={key}
                                className={activeMenu === key ? "active" : ""}
                                onClick={() => setActiveMenu(key)}
                                title={description}
                            >
                                {label}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="content-area">
                    {activeMenu ? (
                        <DynamicForm
                            formTitle={activeMenu}
                            fields={formFieldsToRender}
                        />
                    ) : (
                        <UserDashboardHome />
                    )}
                </main>
            </div>
        </div>
    );
}
