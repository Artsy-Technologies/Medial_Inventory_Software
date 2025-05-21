const db = require('../db/db');

exports.createStockRule = (data, callback) => {
  const {
    item_name, uom, pack_size, moq, adr, lead_time,
    lod_stock, ss, rol, max_stock
  } = data;

  const query = `
    INSERT INTO stock_rules 
    (item_name, uom, pack_size, moq, adr, lead_time, lod_stock, ss, rol, max_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    item_name, uom, pack_size, moq, adr, lead_time,
    lod_stock, ss, rol, max_stock
  ];

  db.query(query, values, callback);
};
