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