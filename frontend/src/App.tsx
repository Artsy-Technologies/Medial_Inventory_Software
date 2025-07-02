import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { FaChartBar } from "react-icons/fa";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    Link,
    Navigate, // Import Navigate
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
    FaDownload, // Import download icon
    FaUpload, // Import upload icon
} from "react-icons/fa";
import "./styles.css";

// Existing forms & fields from your code
const formList = [
    "Material Ordering - Stock",
    "Material Ordering - Generate Order",
    "Vendor Communication Portal (VCP)",
    "Vendor Creation",
    "Location Master",
    "Material Receipt Note (MRN)",
    "Binning",
    "Buying Item Master",
];

const formFields = {
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

// New Sidebar menu options for User and Admin dashboards
const userMenu = [
    {
        key: "Create Stock Rule",
        label: (
            <>
                {" "}
                <FaBox /> Create Stock Rule
            </>
        ),
        description: "Fill stock rule form for new items.",
    },
    {
        key: "View Stock Rules",
        label: (
            <>
                {" "}
                <FaClipboardList /> View Stock Rules
            </>
        ),
        description: "See stock rules list (with calculated fields like ROL, ADR)",
    },
    {
        key: "View Purchase Orders (PO)",
        label: (
            <>
                {" "}
                <FaShoppingCart /> View Purchase Orders (PO)
            </>
        ),
        description:
            "System suggests items below ROL — user selects vendor and confirms PO",
    },
    {
        key: "Search Inventory",
        label: (
            <>
                {" "}
                <FaUserTie /> Search / View Inventory
            </>
        ),
        description: "Lookup items, quantities, bin locations (read-only)",
    },
    {
        key: "Record Material Receipt",
        label: (
            <>
                {" "}
                <FaInbox /> Record Material Receipt (MRN)
            </>
        ),
        description: "Scan/enter invoice → fill MRN form for incoming goods",
    },
    {
        key: "Binning",
        label: (
            <>
                {" "}
                <FaArchive /> Binning
            </>
        ),
        description: "Assign received items to storage bins",
    },
];

const adminMenu = [
    {
        key: "Manage Users",
        label: (
            <>
                {" "}
                <FaUsers /> Manage Users
            </>
        ),
        description: "Add, remove, or edit user accounts + assign roles",
    },
    {
        key: "Manage Vendors",
        label: (
            <>
                {" "}
                <FaTag /> Manage Vendors
            </>
        ),
        description: "Add/update vendor master (code, address, logistics, etc.)",
    },
    {
        key: "Manage Items",
        label: (
            <>
                {" "}
                <FaPills /> Manage Items
            </>
        ),
        description: "Add/update item master (UOM, pack size, type, etc.)",
    },
    {
        key: "Manage Stock Rules",
        label: (
            <>
                {" "}
                <FaBox /> Manage Stock Rules
            </>
        ),
        description: "Same as user + can edit/delete all rules",
    },
    {
        key: "View All Purchase Orders (POs)",
        label: (
            <>
                {" "}
                <FaShoppingCart /> View All Purchase Orders (POs)
            </>
        ),
        description: "See and filter all POs across users and statuses",
    },
    {
        key: "View All MRNs",
        label: (
            <>
                {" "}
                <FaInbox /> View All MRNs
            </>
        ),
        description: "See all received items and match them to POs",
    },
    {
        key: "View Binning Logs",
        label: (
            <>
                {" "}
                <FaArchive /> View Binning Logs
            </>
        ),
        description: "See all bin transactions across users",
    },
    {
        key: "Reports",
        label: (
            <>
                {" "}
                <FaChartBar /> Reports / Export
            </>
        ),
        description: "Download PO reports, stock data, vendor reports, etc.",
    },
];

// Initial user data
const initialAdminUsers = [
    {
        id: 1,
        username: "admin",
        name: "Admin User",
        email: "admin@medvendo.com",
        phone_number: "0000000000",
        password: "123",
    },
];
const initialNormalUsers = [
    {
        id: 1,
        username: "user",
        name: "Normal User",
        email: "user@medvendo.com",
        phone_number: "1111111111",
        password: "123",
    },
];

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            console.log("Searching for:", searchTerm);
            alert(`Searching for: ${searchTerm}`);
        } else {
            // alert("Please enter a search term.");
        }
    };

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
                    </div>
                    {/* Removed the About Us link from here as per request */}
                </nav>
            </header>
            <main className="homepage-content">
                <img
                    src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                    alt="Medvendo Logo"
                    className="main-logo"
                />
                <p className="tagline">MAKING HEALTHCARE BETTER TOGETHER</p>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="auth-links">
                    <Link to="/login">Login</Link> / <Link to="/signup">Sign Up</Link>{" "}
                    {/* Changed Sign In to Sign Up */}
                </div>
            </main>

            {/* About Us section, directly on the homepage */}
            <section id="about-us-section" className="about-us-container">
                {/* Removed the About Us heading as per request */}
                <p>
                    Welcome to Artsy Technologies Pvt Ltd, where we specialize in Business
                    Automation, Training & Internship Programs, and cutting-edge Digital
                    Marketing Services. Our mission is to leverage technology to foster
                    growth and drive success for businesses through innovative solutions
                    like Chatbots, Analytics, and comprehensive training courses.
                </p>
                {/* Added 2-3 images related to the function of the site here */}
                <div className="about-us-images">
                    {/* Placeholder images - replace with your actual image paths and alt text */}
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/man-robot-working-together-high-tech-office_23-2151966702.jpg_semt=ais_hybrid&w=740"
                        alt="Automation Solutions"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/1729953162129_e=2147483647&v=beta&t=RPKsap9FuEFgqdnEriQJ7Yqjk4-zkwTNsQgx61MsIoQ"
                        alt="Training Programs"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/Digital-Marketing.png_itok=EllAJQXD"
                        alt="Digital Marketing"
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
                        {/* Removed Website and Instagram links as per request */}
                        <li>Phone: 6363787944</li>
                        <li>Email: info@artsytech.in</li> {/* Added a placeholder email */}
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
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        if (!username || !password) {
            setError("Please enter both username and password."); // More informative error message
            return;
        }

        // Username validation: Only letters
        const usernameRegex = /^[a-zA-Z]+$/;
        if (!usernameRegex.test(username)) {
            setError("Username must only contain letters.");
            return;
        }

        // Password validation: Minimum 6 characters, at least one uppercase, one symbol, one number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{6,}$/;
        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 6 characters long and include one uppercase letter, one symbol, and one number."
            );
            return;
        }

        setError(""); // Clear any previous error

        const users = role === "admin" ? adminUsers : normalUsers;
        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );
        if (foundUser) {
            onLogin(foundUser, role);
            navigate(`/${role}`);
        } else {
            setError(
                "Incorrect username or password. Please double-check your credentials."
            ); // More informative error message
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
                <Link to="/" className="back-button-round">
                    <FaArrowLeft />
                </Link>
                {error && <p className="error-message">{error}</p>}
                <select onChange={(e) => setRole(e.target.value)} value={role}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="password-toggle-icon"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button onClick={handleLogin}>Login</button>
                <p>
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-button">
                        Sign Up
                    </Link>{" "}
                    {/* Changed Sign In to Sign Up here too */}
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
    const [phone_number, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Only one toggle state needed
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // New: Basic phone number validation (10 digits)
    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSignup = () => {
        let isValid = true;
        const newErrors = {};

        if (!username) {
            newErrors.username = "Please enter a username to create your account.";
            isValid = false;
        } else {
            // Username validation: Only letters
            const usernameRegex = /^[a-zA-Z]+$/;
            if (!usernameRegex.test(username)) {
                newErrors.username =
                    "Username must only contain letters.";
                isValid = false;
            }
        }
        if (!email) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email =
                "Please enter a valid email address (e.g., example@domain.com).";
            isValid = false;
        }
        if (!phone_number) {
            newErrors.phone_number = "Phone number is required.";
            isValid = false;
        } else if (!validatePhone(phone_number)) {
            // Added phone validation
            newErrors.phone_number = "Please enter a valid 10-digit phone number.";
            isValid = false;
        }
        if (!password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else {
            // Password validation: Minimum 6 characters, at least one uppercase, one symbol, one number
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{6,}$/;
            if (!passwordRegex.test(password)) {
                newErrors.password =
                    "Password must be at least 6 characters long and include one uppercase letter, one symbol, and one number.";
                isValid = false;
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match. Please re-enter.";
                isValid = false;
            }
        }


        setErrors(newErrors);

        if (isValid) {
            const users = role === "admin" ? adminUsers : normalUsers;
            const userExists = users.some((u) => u.username === username);
            if (userExists) {
                setErrors({
                    ...newErrors,
                    username: "This username is already taken. Please choose another.",
                });
                return;
            }
            const newId = users.length ? users[users.length - 1].id + 1 : 1;
            const newUser = {
                id: newId,
                username,
                email,
                phone_number,
                password,
            };
            onSignup(newUser, role);
            navigate("/login");
        } else {
            // Alert user that there are validation errors, messages are shown under fields
            alert("Please correct the highlighted errors in the form.");
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
                <Link to="/" className="back-button-round">
                    <FaArrowLeft />
                </Link>
                <select onChange={(e) => setRole(e.target.value)} value={role}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
                <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone_number}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone_number && (
                    <p className="error-message">{errors.phone_number}</p>
                )}
                <div className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="password-toggle-icon"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
                {/* Removed the separate password-input-container and toggle for confirm password */}
                <input
                    type="password" // Always type password for confirm password
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword}</p>
                )}
                <button onClick={handleSignup}>Sign Up</button>
                <p>
                    Already have an account?{" "}
                    <Link to="/" className="link-button">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

const handleDownloadCsv = () => {
    // Placeholder function for downloading CSV
    alert("Download CSV functionality will be implemented here.");
    // In a real application, this would involve fetching data and converting it to CSV format.
};

const handleUploadCsv = () => {
    // Placeholder function for uploading CSV
    alert("Upload CSV functionality will be implemented here.");
    // In a real application, this would involve handling file selection, reading the CSV, and populating the form.
};

// Helper to get form fields for each admin/user menu option
const formFieldsForMenu = {
    // User Dashboard forms (mapped to your existing formFields where possible)
    "View Stock Rules": [
        "Stock Levels",
        "Reorder Thresholds",
        "Item Categories",
        "Supplier Information",
        "Last Updated Date",
    ],
    "View Purchase Orders (PO)": [
        "Purchase Order Number",
        "Date of Order",
        "Supplier Name",
        "Order Status (Pending, Completed, Cancelled)",
        "Total Amount",
        "Delivery Date",
    ],
    "Search Inventory": [
        "Search Bar (Product Name, SKU)",
        "Filters (Category, Expiration Date, Location)",
        "Item Details (Quantity, Stock Status, Last Order Date)",
    ],
    "Create Stock Rule": formFields["Material Ordering - Stock"],
    "Generate Purchase Order": formFields["Material Ordering - Generate Order"],
    "Record Material Receipt": formFields["Material Receipt Note (MRN)"],
    Binning: formFields.Binning,

    // Admin Dashboard forms
    "Manage Users": [
        "Username",
        "Name",
        "Email",
        "Phone Number",
        "Role",
        "Password",
    ],
    "Manage Vendors": [
        "Vendor Name",
        "Code",
        "Address",
        "Item Type",
        "Logistics Method",
    ],
    "Manage Items": ["Item Name", "UOM", "Pack Size", "Item Type", "Price"],
    "Manage Stock Rules": formFields["Material Ordering - Stock"],
    "View All Purchase Orders (POs)": [
        "Purchase Order Number",
        "Supplier Name",
        "Date of Order",
        "Status Filters (All, Pending, Completed)",
        "Total Amount",
        "Expected Delivery Dates",
    ],
    "View All MRNs": [
        "Patient Name", // This field was in your provided `formFieldsForMenu` but in your original `formFields` MRN stood for Material Receipt Note. Keeping it as is, but flagged for review.
        "MRN",
        "Date of Birth",
        "Admission Date",
        "Last Visit Date",
        "Status (Active, Inactive)",
    ],
    "View Binning Logs": [
        "Item Name",
        "Bin Location",
        "Date Added",
        "User Logged",
        "Quantity Added",
        "Quantity Removed",
    ],
    Reports: [
        "Report Type Selection (Inventory, Purchase Orders, Patient Records)",
        "Date Range Selection",
        "Output Format (PDF, CSV, Excel)",
        "Custom Report Criteria",
        "Export All Data or Selected Items",
    ],
};

const UserDashboardHome = () => (
    <div className="dashboard-home">
        <h2>User Dashboard Overview</h2>
        <p>Here you will see key statistics and information relevant to your role.</p>
        <div className="dashboard-stats">
            <div className="stat-card">
                <h3>Items Running Low</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
            <div className="stat-card">
                <h3>Items to Order</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
            <div className="stat-card">
                <h3>Other Relevant Stats</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
        </div>
    </div>
);

const AdminDashboardHome = () => (
    <div className="dashboard-home">
        <h2>Admin Dashboard Overview</h2>
        <p>Here you can monitor key metrics and manage the system.</p>
        <div className="dashboard-stats">
            <div className="stat-card">
                <h3>Total Users</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
            <div className="stat-card">
                <h3>Orders in Progress</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
            <div className="stat-card">
                <h3>Completed Orders</h3>
                {/* Placeholder for data */}
                <p>Loading...</p>
            </div>
        </div>
    </div>
);

const Dashboard = ({ role, onLogout, currentUser }) => {
    const navigate = useNavigate(); // Get navigate function
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const menuOptions = role === "admin" ? adminMenu : userMenu;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            console.log(`Searching for: ${searchTerm} in ${role} dashboard`);
            alert(`Searching for: ${searchTerm} in ${role} dashboard`);
        } else {
            // alert("Please enter a search term.");
        }
    };

    const handleLogoutAndRedirect = () => {
        onLogout();
        navigate("/"); // Redirect to homepage after logout
    };

    return (
        <div className="dashboard-container">
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
                    <span style={{ marginRight: "20px" }}>
                        Welcome, {currentUser.username} {currentUser.name}
                    </span>
                    <button className="logout-btn" onClick={handleLogoutAndRedirect}>
                        Logout
                    </button>
                </div>
            </div>

            <nav className="main-nav">
                <div className="logo">
                    <span className="dashboard-title">
                        {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                    </span>
                </div>
                <ul className="nav-links"></ul>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </nav>

            <div className="dashboard-main">
                <aside className="sidebar">
                    <h3>
                        {role === "admin" ? (
                            <>
                                {" "}
                                <FaShieldAlt /> Admin Options
                            </>
                        ) : (
                            <>
                                {" "}
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
                    {role === "admin" && !activeMenu && <AdminDashboardHome />}
                    {role === "user" && !activeMenu && <UserDashboardHome />}

                    <div className="form-content-scrollable">
                        {activeMenu && (
                            <div className="form-container">
                                <h2>{activeMenu}</h2>
                                <div className="csv-buttons">
                                    <button
                                        type="button"
                                        className="download-btn"
                                        onClick={handleDownloadCsv}
                                    >
                                        <FaDownload /> Download CSV
                                    </button>
                                    <button
                                        type="button"
                                        className="upload-btn"
                                        onClick={handleUploadCsv}
                                    >
                                        <FaUpload /> Upload CSV
                                    </button>
                                </div>
                                {formFieldsForMenu[activeMenu]?.length > 0 ? (
                                    <form>
                                        {formFieldsForMenu[activeMenu].map((field, idx) => (
                                            <div className="form-group" key={idx}>
                                                <label>{field}</label>
                                                {field.includes("Status Filters") ||
                                                    field.includes("Report Type Selection") ||
                                                    field.includes("Output Format") ? (
                                                    <select>
                                                        <option value="">
                                                            Select {field.split("(")[0].trim()}
                                                        </option>
                                                        {field.includes("Status Filters") &&
                                                            ["All", "Pending", "Completed"].map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        {field.includes("Report Type Selection") &&
                                                            [
                                                                "Inventory",
                                                                "Purchase Orders",
                                                                "Patient Records",
                                                            ].map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        {field.includes("Output Format") &&
                                                            ["PDF", "CSV", "Excel"].map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                    </select>
                                                ) : (
                                                    <input type="text" />
                                                )}
                                            </div>
                                        ))}
                                        <button type="submit">Submit</button>
                                    </form>
                                ) : (
                                    <p>No form fields available for this option.</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
    const [normalUsers, setNormalUsers] = useState(initialNormalUsers);

    const handleLogin = (user, role) => {
        setLoggedInUser(user);
        setUserRole(role);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setUserRole(null);
    };

    const handleSignup = (newUser, role) => {
        if (role === "admin") {
            setAdminUsers([...adminUsers, newUser]);
        } else {
            setNormalUsers([...normalUsers, newUser]);
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/login"
                    element={
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
                        loggedInUser && userRole === "admin" ? (
                            <Dashboard
                                role={userRole}
                                onLogout={handleLogout}
                                currentUser={loggedInUser}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/user"
                    element={
                        loggedInUser && userRole === "user" ? (
                            <Dashboard
                                role={userRole}
                                onLogout={handleLogout}
                                currentUser={loggedInUser}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
export default App;
