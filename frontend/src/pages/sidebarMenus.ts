import React from "react";
import {
    FaBox,
    FaArchive,
    FaClipboardList,
    FaShoppingCart,
    FaInbox,
    FaUserTie,
    FaUsers,
    FaTag,
    FaPills,
    FaChartBar,
} from "react-icons/fa";

// Form fields configuration
export const FORM_FIELDS = {
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

// User menu configuration
export const userMenu = [
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

// Admin menu configuration
export const adminMenu = [
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

// Form fields for menu (if needed separately)
export const formFieldsForMenu = FORM_FIELDS;
