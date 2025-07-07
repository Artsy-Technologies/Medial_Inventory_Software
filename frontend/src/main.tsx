import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    Link,
    Navigate,
} from "react-router-dom";
import {
    FaArrowLeft,
    FaBox,
    FaArchive,
    FaClipboardList,
    FaShoppingCart,
    FaInbox,
    FaUserTie,
    FaUsers,
    FaTag,
    FaPills,
    FaShieldAlt,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaDownload,
    FaUpload,
    FaChartBar,
} from "react-icons/fa";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import "./index.css";

// --- Data Definitions ---

// Existing forms & fields: Consolidating and rationalizing
const FORM_FIELDS = {
    "Material Ordering - Stock": [
        "Select Item",
        "Select Vendor",
        "Enter MOQ",
        "Enter Lead time to Delivery",
        "Stock Rule",
        "Enter Safety Stock",
        "Enter ROL",
        "Enter Maximum Stock",
        "Enter Pack Qty",
    ],
    "Material Ordering - Generate Order": [
        "Select Vendor",
        "Generate Pick List",
        "Authorize Picklist - Give modify options",
        "Generate Purchase Order",
    ],
    "Vendor Communication Portal (VCP)": [
        "Share PO",
        "Get vendor confirmation",
        "Check vendor invoice",
    ],
    "Vendor Creation": [
        "Enter Vendor Name",
        "Enter Code",
        "Vendor Registration details",
        "Vendor Address",
        "Vendor Item type",
        "Logistics method",
        "Press Save button",
        "Edit option",
    ],
    "Location Master": [
        "Enter Location Name",
        "Select Location type (Main or Sub)",
        "Enter Location Code",
        "Generate Location QR/Bar code",
        "Print Location Labels",
    ],
    "Material Receipt Note (MRN)": [
        "Scan Vendor",
        "Scan Invoice or do manual entry",
        "Save Transaction with unique transaction id",
    ],
    Binning: [
        "Scan Main location",
        "Scan Sub-location",
        "Scan item or Invoice to transfer stock",
        "Save transaction",
    ],
    "Buying Item Master": [
        "Enter Item Name",
        "Enter Item Code",
        "Enter Item Specification",
        "Item Type",
        "Define Unit of measurement (UOM)",
        "Select Vendors",
        "Auto pick item price from latest batch",
        "Check average price of last 10 batches",
    ],
};

// Sidebar menu options for User and Admin dashboards
const USER_MENU = [
    {
        key: "Create Stock Rule",
        label: (
            <>
                <FaBox /> Create Stock Rule
            </>
        ),
        description: "Fill stock rule form for new items.",
        fields: FORM_FIELDS["Material Ordering - Stock"],
    },
    {
        key: "View Stock Rules",
        label: (
            <>
                <FaClipboardList /> View Stock Rules
            </>
        ),
        description: "See stock rules list (with calculated fields like ROL, ADR)",
        fields: [
            "Stock Levels",
            "Reorder Thresholds",
            "Item Categories",
            "Supplier Information",
            "Last Updated Date",
        ],
    },
    {
        key: "View Purchase Orders (PO)",
        label: (
            <>
                <FaShoppingCart /> View Purchase Orders (PO)
            </>
        ),
        description:
            "System suggests items below ROL — user selects vendor and confirms PO",
        fields: [
            "Purchase Order Number",
            "Date of Order",
            "Supplier Name",
            "Order Status (Pending, Completed, Cancelled)",
            "Total Amount",
            "Delivery Date",
        ],
    },
    {
        key: "Search Inventory",
        label: (
            <>
                <FaUserTie /> Search / View Inventory
            </>
        ),
        description: "Lookup items, quantities, bin locations (read-only)",
        fields: [
            "Search Bar (Product Name, SKU)",
            "Filters (Category, Expiration Date, Location)",
            "Item Details (Quantity, Stock Status, Last Order Date)",
        ],
    },
    {
        key: "Record Material Receipt",
        label: (
            <>
                <FaInbox /> Record Material Receipt (MRN)
            </>
        ),
        description: "Scan/enter invoice → fill MRN form for incoming goods",
        fields: FORM_FIELDS["Material Receipt Note (MRN)"],
    },
    {
        key: "Binning",
        label: (
            <>
                <FaArchive /> Binning
            </>
        ),
        description: "Assign received items to storage bins",
        fields: FORM_FIELDS.Binning,
    },
];

const ADMIN_MENU = [
    {
        key: "Manage Users",
        label: (
            <>
                <FaUsers /> Manage Users
            </>
        ),
        description: "Add, remove, or edit user accounts + assign roles",
        fields: ["Username", "Name", "Email", "Phone Number", "Role", "Password"],
    },
    {
        key: "Manage Vendors",
        label: (
            <>
                <FaTag /> Manage Vendors
            </>
        ),
        description: "Add/update vendor master (code, address, logistics, etc.)",
        fields: FORM_FIELDS["Vendor Creation"],
    },
    {
        key: "Manage Items",
        label: (
            <>
                <FaPills /> Manage Items
            </>
        ),
        description: "Add/update item master (UOM, pack size, type, etc.)",
        fields: FORM_FIELDS["Buying Item Master"],
    },
    {
        key: "Manage Stock Rules",
        label: (
            <>
                <FaBox /> Manage Stock Rules
            </>
        ),
        description: "Same as user + can edit/delete all rules",
        fields: FORM_FIELDS["Material Ordering - Stock"],
    },
    {
        key: "View All Purchase Orders (POs)",
        label: (
            <>
                <FaShoppingCart /> View All Purchase Orders (POs)
            </>
        ),
        description: "See and filter all POs across users and statuses",
        fields: [
            "Purchase Order Number",
            "Supplier Name",
            "Date of Order",
            "Status Filters (All, Pending, Completed)",
            "Total Amount",
            "Expected Delivery Dates",
        ],
    },
    {
        key: "View All MRNs",
        label: (
            <>
                <FaInbox /> View All MRNs
            </>
        ),
        description: "See all received items and match them to POs",
        fields: [
            "MRN ID",
            "Vendor Name",
            "Invoice Number",
            "Receipt Date",
            "Items Received",
            "Associated PO",
        ],
    },
    {
        key: "View Binning Logs",
        label: (
            <>
                <FaArchive /> View Binning Logs
            </>
        ),
        description: "See all bin transactions across users",
        fields: [
            "Item Name",
            "Bin Location",
            "Date Added",
            "User Logged",
            "Quantity Added",
            "Quantity Removed",
        ],
    },
    {
        key: "Reports",
        label: (
            <>
                <FaChartBar /> Reports / Export
            </>
        ),
        description: "Download PO reports, stock data, vendor reports, etc.",
        fields: [
            "Report Type Selection (Inventory, Purchase Orders, Binning, User Activity)",
            "Date Range Selection",
            "Output Format (PDF, CSV, Excel)",
            "Custom Report Criteria",
            "Export All Data or Selected Items",
        ],
    },
];

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

// --- Reusable Components ---

/**
 * A generic form component that dynamically renders fields based on props.
 * Includes CSV download/upload buttons.
 */
const DynamicForm = ({ formTitle, fields }) => {
    const fileInputRef = useRef(null); // Ref for the hidden file input

    const handleDownloadCsv = () => {
        // Dummy data for demonstration
        const dummyData = [
            ["Header1", "Header2", "Header3"],
            ["Data1A", "Data1B", "Data1C"],
            ["Data2A", "Data2B", "Data2C"],
        ];

        // Convert data to CSV format
        const csvContent = dummyData.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        // Create a temporary URL and link to trigger download
        const link = document.createElement("a");
        if (link.download !== undefined) { // Feature detection for download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${formTitle.replace(/\s/g, '_')}_data.csv`);
            link.style.visibility = 'hidden'; // Hide the link
            document.body.appendChild(link);
            link.click(); // Programmatically click the link
            document.body.removeChild(link); // Clean up
            URL.revokeObjectURL(url); // Release the object URL
        } else {
            // Fallback for browsers that don't support the download attribute
            alert("Your browser does not support automatic CSV download. Please save the content manually.");
            console.log(csvContent); // Log content for manual copy
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input click
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file for upload:", file.name, file);
            // Here you would typically read the file and send its content to a backend
            // For demonstration, we'll just log it.
            alert(`File "${file.name}" selected for upload. In a real app, this would be processed.`);
            // Example: If you want to read the file content:
            // const reader = new FileReader();
            // reader.onload = (e) => {
            //     const content = e.target.result;
            //     console.log("File content:", content);
            //     // Process CSV content here
            // };
            // reader.readAsText(file);
        }
        // Clear the input value to allow selecting the same file again if needed
        event.target.value = null;
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
                    style={{ display: 'none' }} // Hide the actual file input
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

/**
 * Component for the User Dashboard Home content.
 * Displays placeholder statistics with charts.
 */
const UserDashboardHome = () => {
    // Placeholder data for charts
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
                            <CartesianGrid strokeDashArray="3 3" />
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
                            <CartesianGrid strokeDashArray="3 3" />
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
                            <CartesianGrid strokeDashArray="3 3" />
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

/**
 * Component for the Admin Dashboard Home content.
 * Displays placeholder statistics with charts.
 */
const AdminDashboardHome = () => {
    // Placeholder data for charts
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
                            <CartesianGrid strokeDashArray="3 3" />
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
                            <CartesianGrid strokeDashArray="3 3" />
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

// --- Page Components ---

const HomePage = () => {
    // Removed searchTerm state and handleSearchChange as search bar is removed

    return (
        <div className="homepage">
            <header>
                <nav>
                    <div className="logo-container">
                        <img
                            src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                            alt="Medvendo Logo"
                            className="header-logo"
                        />
                        {/* Added Medvendo name */}
                        <span className="company-name-header">Medvendo</span>
                    </div>
                </nav>
            </header>
            <main className="homepage-content">
                <img
                    src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                    alt="Medvendo Logo"
                    className="main-logo"
                />
                <p className="tagline">MAKING HEALTHCARE BETTER TOGETHER</p>
                {/* Removed search-bar div */}
                <div className="auth-links">
                    <Link to="/login">Login</Link> / <Link to="/signup">Sign Up</Link>
                </div>
            </main>

            <section id="about-us-section" className="about-us-container">
                <p>
                    Welcome to Artsy Technologies Pvt Ltd, where we specialize in Business
                    Automation, Training & Internship Programs, and cutting-edge Digital
                    Marketing Services. Our mission is to leverage technology to foster
                    growth and drive success for businesses through innovative solutions
                    like Chatbots, Analytics, and comprehensive training courses.
                </p>
                <div className="about-us-images">
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/man-robot-working-together-high-tech-office_23-2151966702.jpg_semt=ais_hybrid&w=740"
                        alt="Automation Solutions"
                        loading="lazy"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/1729953162129_e=2147483647&v=beta&t=RPKsap9FuEFhGqdnEriQJ7Yqjk4-zkwTNsQgx61MsIoQ"
                        alt="Training Programs"
                        loading="lazy"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/Digital-Marketing.png_itok=EllAJQXD"
                        alt="Digital Marketing"
                        loading="lazy"
                    />
                </div>
                <p>
                    At Artsy Technologies, we are committed to excellence and continuous
                    learning. Our team of dedicated professionals employs state-of-the-art
                    technologies to develop seamless solutions that push the boundaries of
                    innovation. By joining us, you are not just partnering with an agency;
                    you are embarking on a journey to a more connected future.
                </p>
                <p>
                    We pride ourselves on providing exceptional service and unmatched
                    support to our clients. With extensive expertise and experience, we
                    tackle even the most complex technology challenges, ensuring that our
                    clients are well-equipped to thrive in today’s dynamic digital
                    environment.
                </p>
                <blockquote className="philosophy">
                    <p>
                        "Technology, like art, is a soaring exercise of the human
                        imagination."
                    </p>
                </blockquote>
                <div className="connect-with-us">
                    <h3>Connect with Us:</h3>
                    <ul>
                        <li>Phone: 6363787944</li>
                        <li>Email: info@artsytech.in</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

const LoginPage = ({ adminUsers, normalUsers, onLogin }) => {
    const navigate = useNavigate();
    const [role, setRole] = useState("admin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = (e) => {
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
                            tabIndex="0"
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
};

const SignupPage = ({ adminUsers, normalUsers, onSignup }) => {
    const navigate = useNavigate();
    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSignup = (e) => {
        e.preventDefault();

        let currentErrors = {};
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
            onSignup(newUser, role);
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
                            tabIndex="0"
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
};

/**
 * Main Dashboard component for both Admin and User roles.
 * Renders sidebar menu and dynamic content area.
 */
const Dashboard = ({ role, onLogout, currentUser }) => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);

    const menuOptions = role === "admin" ? ADMIN_MENU : USER_MENU;

    const handleLogoutAndRedirect = () => {
        onLogout();
        navigate("/");
    };

    const currentActiveMenuItem = menuOptions.find(item => item.key === activeMenu);
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
                    {/* Added Medvendo name */}
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

            {/* Main Navigation (Dashboard Title) - Search bar removed */}
            <nav className="main-nav">
                <div className="dashboard-header">
                    <span className="dashboard-title">
                        {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                    </span>
                    {/* Removed search-container div */}
                </div>
            </nav>

            {/* Dashboard Main Content Area (Sidebar + Content) */}
            <div className="dashboard-main">
                <aside className="sidebar">
                    <h3>
                        {role === "admin" ? (
                            <>
                                <FaShieldAlt /> Admin Options
                            </>
                        ) : (
                            <>
                                <FaUser /> User Options
                            </>
                        )}
                    </h3>
                    <ul>
                        {menuOptions.map(({ key, label, description }) => (
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
                    ) : role === "admin" ? (
                        <AdminDashboardHome />
                    ) : (
                        <UserDashboardHome />
                    )}
                </main>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
    const [normalUsers, setNormalUsers] = useState(INITIAL_NORMAL_USERS);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);

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

    const handleLogin = (user, role) => {
        setCurrentUser(user);
        setCurrentRole(role);
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("currentRole", role);
    };

    const handleSignup = (newUser, role) => {
        if (role === "admin") {
            setAdminUsers((prevUsers) => [...prevUsers, newUser]);
        } else {
            setNormalUsers((prevUsers) => [...prevUsers, newUser]);
        }
    };

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
                        currentUser ? <Navigate to={`/${currentRole}`} replace /> :
                        <LoginPage
                            adminUsers={adminUsers}
                            normalUsers={normalUsers}
                            onLogin={handleLogin}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        currentUser ? <Navigate to={`/${currentRole}`} replace /> :
                        <SignupPage
                            adminUsers={adminUsers}
                            normalUsers={normalUsers}
                            onSignup={handleSignup}
                        />
                    }
                />
                <Route
                    path="/admin"
                    element={
                        currentUser && currentRole === "admin" ? (
                            <Dashboard
                                role="admin"
                                onLogout={handleLogout}
                                currentUser={currentUser}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/user"
                    element={
                        currentUser && currentRole === "user" ? (
                            <Dashboard
                                role="user"
                                onLogout={handleLogout}
                                currentUser={currentUser}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

createRoot(document.getElementById("root")).render(<App />);
export default App;
