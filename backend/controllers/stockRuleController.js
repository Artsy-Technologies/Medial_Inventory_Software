const StockRule = require('../models/stockRuleModel');
const db = require('../db/db');

exports.createStockRule = (req, res) => {
  const data = req.body;

  // Optional: validate required fields here
  if (!data.item_name || !data.moq) {
    return res.status(400).json({ error: 'Item Name and MOQ are required' });
  }

  StockRule.createStockRule(data, (err, result) => {
    if (err) {
      console.error('Error creating stock rule:', err);
      return res.status(500).json({ error: 'DB error while creating stock rule' });
    }

    res.status(201).json({ message: 'Stock rule created', id: result.insertId });
  });
};

exports.getAllStockRules = (req, res) => {
  db.query('SELECT * FROM stock_rules', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching stock rules' });
    res.json(results);
  });
};

exports.getStockRuleById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM stock_rules WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching stock rule' });
    if (results.length === 0) return res.status(404).json({ error: 'Stock rule not found' });
    res.json(results[0]);
  });
};

exports.updateStockRule = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const query = `
    UPDATE stock_rules SET 
      item_name = ?, uom = ?, pack_size = ?, moq = ?, adr = ?, 
      lead_time = ?, lod_stock = ?, ss = ?, rol = ?, max_stock = ?
    WHERE id = ?
  `;

  const values = [
    data.item_name, data.uom, data.pack_size, data.moq, data.adr,
    data.lead_time, data.lod_stock, data.ss, data.rol, data.max_stock,
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error updating stock rule' });
    res.json({ message: 'Stock rule updated' });
  });
};

exports.deleteStockRule = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM stock_rules WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error deleting stock rule' });
    res.json({ message: 'Stock rule deleted' });
  });
};
