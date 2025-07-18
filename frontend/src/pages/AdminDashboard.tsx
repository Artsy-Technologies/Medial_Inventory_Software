import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaDownload, FaUpload } from "react-icons/fa";
import { adminMenu } from "../../config/sidebarMenus";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface AdminDashboardProps {
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

// Admin Dashboard Home Component
const AdminDashboardHome = () => {
    const userRolesData = [
        { name: 'Admins', value: 2 },
        { name: 'Users', value: 13 },
    ];
    const orderStatusData = [
        { name: 'Pending', value: 3 },
        { name: 'Processing', value: 4 },
        { name: 'Shipped', value: 2 },
        { name: 'Delivered', value: 1 },
    ];
    const completedOrdersData = [
        { name: 'Jan', orders: 10 },
        { name: 'Feb', orders: 15 },
        { name: 'Mar', orders: 22 },
        { name: 'Apr', orders: 18 },
        { name: 'May', orders: 25 },
        { name: 'Jun', orders: 30 },
    ];

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="dashboard-home">
            <h2>Admin Dashboard Overview</h2>
            <p>Here you can monitor key metrics and manage the system.</p>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Users by Role</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <Pie
                                data={userRolesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {userRolesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="stat-card">
                    <h3>Orders in Progress</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={orderStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#ffc107" name="Number of Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="stat-card">
                    <h3>Completed Orders (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={completedOrdersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="orders" stroke="#007bff" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboard({ onLogout, currentUser }: AdminDashboardProps) {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleLogoutAndRedirect = () => {
        onLogout();
        navigate("/");
    };

    const currentActiveMenuItem = adminMenu.find(item => item.key === activeMenu);
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
                    <span className="dashboard-title">Admin Dashboard</span>
                </div>
            </nav>

            {/* Dashboard Main Content Area */}
            <div className="dashboard-main">
                <aside className="sidebar">
                    <h3>
                        <FaShieldAlt /> Admin Options
                    </h3>
                    <ul>
                        {adminMenu.map(({ key, label, description }) => (
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
                        <AdminDashboardHome />
                    )}
                </main>
            </div>
        </div>
    );
}
