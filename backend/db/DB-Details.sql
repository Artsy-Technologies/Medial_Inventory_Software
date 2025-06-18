CREATE DATABASE inventory_mgmt;
USE inventory_mgmt;

CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(15),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Vendors (
  vendor_id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_name VARCHAR(100) NOT NULL,
  vendor_code VARCHAR(20) NOT NULL UNIQUE,
  registration_details TEXT,
  address TEXT,
  item_type VARCHAR(50),
  logistics_method VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  item_code VARCHAR(20) NOT NULL UNIQUE,
  item_specification TEXT,
  item_type VARCHAR(50),
  pack_size INT,
  uom VARCHAR(20),
  latest_price DECIMAL(10,2),
  avg_price_10_batches DECIMAL(10,2),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Vendor_Items (
  vendor_item_id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  item_id INT NOT NULL,
  price DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Stock_Rules (
  rule_id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  moq INT,
  pack_size INT,
  pack_density DECIMAL(10,2),
  adr_mode ENUM('manual', 'auto'),
  adr_months INT,
  adr DECIMAL(10,2),
  lod INT,
  lod_stock INT,
  safety_stock INT,
  rol INT,
  max_stock INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Activity_Log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  description TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  location_name VARCHAR(100),
  location_type VARCHAR(50),
  location_code VARCHAR(50),
  parent_location_id INT,
  qr_barcode VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Purchase_Orders (
  po_id INT AUTO_INCREMENT PRIMARY KEY,
  po_number VARCHAR(50),
  vendor_id INT,
  order_date DATE,
  status VARCHAR(50),
  total_amount DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
);

CREATE TABLE PO_Items (
  po_item_id INT AUTO_INCREMENT PRIMARY KEY,
  po_id INT,
  item_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  tax_percent DECIMAL(5,2),
  gst_type ENUM('intra', 'inter'),
  cgst DECIMAL(10,2),
  sgst DECIMAL(10,2),
  igst DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (po_id) REFERENCES Purchase_Orders(po_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Material_Receipt_Notes (
  mrn_id INT AUTO_INCREMENT PRIMARY KEY,
  mrn_number VARCHAR(50),
  po_id INT,
  vendor_id INT,
  invoice_number VARCHAR(50),
  invoice_date DATE,
  receipt_date DATE,
  transaction_reference VARCHAR(100),
  scanned_by INT,
  received_by INT,
  total_invoice_value DECIMAL(10,2),
  qr_data_raw TEXT,
  tax_details_json TEXT,
  remarks TEXT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (po_id) REFERENCES Purchase_Orders(po_id),
  FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id),
  FOREIGN KEY (scanned_by) REFERENCES Users(user_id),
  FOREIGN KEY (received_by) REFERENCES Users(user_id)
);

CREATE TABLE MRN_Items (
  mrn_item_id INT AUTO_INCREMENT PRIMARY KEY,
  mrn_id INT,
  po_id INT,
  item_id INT,
  quantity INT,
  batch_number VARCHAR(50),
  price DECIMAL(10,2),
  uom VARCHAR(20),
  expiry_date DATE,
  manufacture_date DATE,
  receiving_location_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mrn_id) REFERENCES Material_Receipt_Notes(mrn_id),
  FOREIGN KEY (po_id) REFERENCES Purchase_Orders(po_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id),
  FOREIGN KEY (receiving_location_id) REFERENCES Locations(location_id)
);

CREATE TABLE Binning_Transactions (
  binning_id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(50),
  mrn_id INT,
  from_location_id INT,
  to_location_id INT,
  scanned_by INT,
  binned_by_user_id INT,
  transaction_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mrn_id) REFERENCES Material_Receipt_Notes(mrn_id),
  FOREIGN KEY (from_location_id) REFERENCES Locations(location_id),
  FOREIGN KEY (to_location_id) REFERENCES Locations(location_id),
  FOREIGN KEY (scanned_by) REFERENCES Users(user_id),
  FOREIGN KEY (binned_by_user_id) REFERENCES Users(user_id)
);

CREATE TABLE Binning_Items (
  binning_item_id INT AUTO_INCREMENT PRIMARY KEY,
  binning_id INT,
  item_id INT,
  quantity INT,
  batch_number VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (binning_id) REFERENCES Binning_Transactions(binning_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE VCP_Transactions (
  vcp_id INT AUTO_INCREMENT PRIMARY KEY,
  po_id INT,
  vendor_id INT,
  transaction_type VARCHAR(50),
  status VARCHAR(50),
  transaction_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (po_id) REFERENCES Purchase_Orders(po_id),
  FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
);

CREATE TABLE ASN_Notes (
  asn_id INT AUTO_INCREMENT PRIMARY KEY,
  po_id INT,
  vendor_id INT,
  expected_delivery_date DATE,
  remarks TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (po_id) REFERENCES Purchase_Orders(po_id),
  FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id)
);

CREATE TABLE Inventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  location_id INT,
  quantity INT,
  last_updated DATETIME,
  FOREIGN KEY (item_id) REFERENCES Items(item_id),
  FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

CREATE TABLE MRN_Scans (
  scan_id INT AUTO_INCREMENT PRIMARY KEY,
  mrn_id INT,
  scanned_text TEXT,
  scanned_at DATETIME,
  scanned_by INT,
  FOREIGN KEY (mrn_id) REFERENCES Material_Receipt_Notes(mrn_id),
  FOREIGN KEY (scanned_by) REFERENCES Users(user_id)
);

CREATE TABLE Notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  type ENUM('info', 'warning', 'error', 'system'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE VIEW view_full_po_details AS
SELECT 
  po.po_id, po.po_number, po.order_date, po.status, po.total_amount,
  v.vendor_name, i.item_name, poi.quantity, poi.unit_price, poi.total_price
FROM Purchase_Orders po
JOIN Vendors v ON po.vendor_id = v.vendor_id
JOIN PO_Items poi ON po.po_id = poi.po_id
JOIN Items i ON poi.item_id = i.item_id;

DELIMITER //

CREATE PROCEDURE update_inventory_after_mrn(IN mrn INT)
BEGIN
  INSERT INTO Inventory (item_id, location_id, quantity, last_updated)
  SELECT 
    mi.item_id, mi.receiving_location_id, mi.quantity, NOW()
  FROM MRN_Items mi
  WHERE mi.mrn_id = mrn
  ON DUPLICATE KEY UPDATE 
    quantity = quantity + VALUES(quantity),
    last_updated = NOW();
END //

DELIMITER ;

CREATE VIEW view_inventory_status AS
SELECT 
  i.item_id,
  i.item_name,
  l.location_name,
  inv.quantity,
  inv.last_updated
FROM Inventory inv
JOIN Items i ON inv.item_id = i.item_id
JOIN Locations l ON inv.location_id = l.location_id;

CREATE VIEW view_pending_pos AS
SELECT 
  po.po_id,
  po.po_number,
  po.order_date,
  v.vendor_name,
  po.status,
  SUM(poi.quantity) AS total_ordered,
  IFNULL(SUM(mi.quantity), 0) AS total_received,
  (SUM(poi.quantity) - IFNULL(SUM(mi.quantity), 0)) AS pending_quantity
FROM Purchase_Orders po
JOIN Vendors v ON po.vendor_id = v.vendor_id
JOIN PO_Items poi ON po.po_id = poi.po_id
LEFT JOIN MRN_Items mi ON poi.po_id = mi.po_id AND poi.item_id = mi.item_id
GROUP BY po.po_id
HAVING pending_quantity > 0;

DELIMITER //

CREATE PROCEDURE create_po (
  IN in_po_number VARCHAR(50),
  IN in_vendor_id INT,
  IN in_order_date DATE,
  IN in_status VARCHAR(50),
  IN in_total_amount DECIMAL(10,2)
)
BEGIN
  INSERT INTO Purchase_Orders (po_number, vendor_id, order_date, status, total_amount)
  VALUES (in_po_number, in_vendor_id, in_order_date, in_status, in_total_amount);
END //

DELIMITER ;

CREATE VIEW view_mrn_summary AS
SELECT 
  mrn.mrn_id,
  mrn.mrn_number,
  mrn.receipt_date,
  v.vendor_name,
  mrn.total_invoice_value,
  u1.username AS scanned_by,
  u2.username AS received_by
FROM Material_Receipt_Notes mrn
JOIN Vendors v ON mrn.vendor_id = v.vendor_id
LEFT JOIN Users u1 ON mrn.scanned_by = u1.user_id
LEFT JOIN Users u2 ON mrn.received_by = u2.user_id;

DELIMITER //

CREATE PROCEDURE log_activity (
  IN in_user_id INT,
  IN in_action VARCHAR(255),
  IN in_table_name VARCHAR(100),
  IN in_record_id INT,
  IN in_description TEXT
)
BEGIN
  INSERT INTO Activity_Log (user_id, action, table_name, record_id, description)
  VALUES (in_user_id, in_action, in_table_name, in_record_id, in_description);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE generate_asn (
  IN in_po_id INT,
  IN in_vendor_id INT,
  IN in_expected_delivery DATE,
  IN in_remarks TEXT
)
BEGIN
  INSERT INTO ASN_Notes (po_id, vendor_id, expected_delivery_date, remarks)
  VALUES (in_po_id, in_vendor_id, in_expected_delivery, in_remarks);
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_po_insert
AFTER INSERT ON Purchase_Orders
FOR EACH ROW
BEGIN
  CALL log_activity(1, 'INSERT', 'Purchase_Orders', NEW.po_id, 'New Purchase Order created');
END //

DELIMITER ;


ALTER TABLE Purchase_Orders ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE Vendors ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE Items ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE Users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE Users 
ADD COLUMN ip_address VARCHAR(45),
ADD COLUMN browser_agent TEXT;

DELIMITER //

CREATE TRIGGER trg_po_update
AFTER UPDATE ON Purchase_Orders
FOR EACH ROW
BEGIN
  CALL log_activity(1, 'UPDATE', 'Purchase_Orders', NEW.po_id, 'Purchase Order updated');
END //

CREATE TRIGGER trg_po_delete
AFTER DELETE ON Purchase_Orders
FOR EACH ROW
BEGIN
  CALL log_activity(1, 'DELETE', 'Purchase_Orders', OLD.po_id, 'Purchase Order deleted');
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS create_po;

DELIMITER //

CREATE PROCEDURE create_po (
  IN in_po_number VARCHAR(50),
  IN in_vendor_id INT,
  IN in_order_date DATE,
  IN in_status VARCHAR(50),
  IN in_total_amount DECIMAL(10,2),
  OUT out_po_id INT
)
BEGIN
  INSERT INTO Purchase_Orders (po_number, vendor_id, order_date, status, total_amount)
  VALUES (in_po_number, in_vendor_id, in_order_date, in_status, in_total_amount);

  SET out_po_id = LAST_INSERT_ID();
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE add_po_item (
  IN in_po_id INT,
  IN in_item_id INT,
  IN in_quantity INT,
  IN in_unit_price DECIMAL(10,2),
  IN in_tax_percent DECIMAL(5,2),
  IN in_gst_type ENUM('intra', 'inter')
)
BEGIN
  DECLARE total DECIMAL(10,2);
  DECLARE cgst_val DECIMAL(10,2);
  DECLARE sgst_val DECIMAL(10,2);
  DECLARE igst_val DECIMAL(10,2);

  SET total = in_quantity * in_unit_price;

  IF in_gst_type = 'intra' THEN
    SET cgst_val = in_tax_percent / 2;
    SET sgst_val = in_tax_percent / 2;
    SET igst_val = 0;
  ELSE
    SET cgst_val = 0;
    SET sgst_val = 0;
    SET igst_val = in_tax_percent;
  END IF;

  INSERT INTO PO_Items (
    po_id, item_id, quantity, unit_price, total_price,
    tax_percent, gst_type, cgst, sgst, igst
  )
  VALUES (
    in_po_id, in_item_id, in_quantity, in_unit_price, total,
    in_tax_percent, in_gst_type, cgst_val, sgst_val, igst_val
  );
END //

DELIMITER ;











