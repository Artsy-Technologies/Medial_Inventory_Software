const mysql = require('mysql2');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "saumya",
  database: "inventory_mgmt",
  clearPassword: true // Add this line
});

module.exports = db;